import { promisify } from 'util';
import cp from 'child_process';

import { Directories, HTTP, Events } from '@vizality/constants';
import { initialize, getModule } from '@vizality/webpack';
import { log, warn, error } from '@vizality/util/logger';
import { Updatable } from '@vizality/entities';
import { sleep } from '@vizality/util/time';

import BuiltinManager from './managers/Builtin';
import PluginManager from './managers/Plugin';
import ThemeManager from './managers/Theme';
import APIManager from './managers/API';

const exec = promisify(cp.exec);

/**
 * @typedef VizalityAPI
 * @property {CommandsAPI} commands
 * @property {SettingsAPI} settings
 * @property {NoticesAPI} notices
 * @property {KeybindsAPI} keybinds
 * @property {RouterAPI} router
 * @property {ConnectionsAPI} connections
 * @property {I18nAPI} i18n
 * @property {RPCAPI} rpc
 */

/**
 * @typedef Git
 * @property {String} upstream
 * @property {String} branch
 * @property {String} revision
 */

/**
 * Main Vizality class
 * @type {Vizality}
 * @property {VizalityAPI} api
 * @property {AddonManager} manager
 * @property {APIManager} _apiManager
 * @property {Git} git
 * @property {boolean} _initialized
 */

export default class Vizality extends Updatable {
  constructor () {
    super(Directories.ROOT, '', 'vizality');

    /*
     * Copy over the VizalityNative to vizality.native and then delete
     * VizalityNative, so that we are staying consistent and only have
     * one top level global variable.
     */
    this.native = window.VizalityNative;
    delete window.VizalityNative;

    this.api = {};
    this.modules = {};
    this.manager = {};
    this.git = {
      upstream: '???',
      branch: '???',
      revision: '???'
    };

    this.manager.apis = new APIManager();
    this.manager.builtins = new BuiltinManager();
    this.manager.plugins = new PluginManager();
    this.manager.themes = new ThemeManager();

    this._initialized = false;
    this._hookRPCServer();
    this._patchWebSocket();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initialize());
    } else {
      this.initialize();
    }
  }

  // Initialization
  async initialize () {
    const isOverlay = (/overlay/).test(location.pathname);
    if (isOverlay) { // eh
      // await sleep(250);
    }

    await initialize(); // Webpack & Modules

    const Flux = getModule('Store', 'PersistedStore');
    Flux.connectStoresAsync = (stores, fn) => Component =>
      require('@vizality/components').AsyncComponent.from((async () => {
        const awaitedStores = await Promise.all(stores);
        // @todo Remember to add these to settings (darkSiderbar, etc.): awaitedStores
        return Flux.connectStores(awaitedStores, props => fn(awaitedStores, props))(Component);
      })());

    await this.start(); // Start
    this.git = await this.manager.builtins.get('vz-updater').getGitInfo();

    /* Token manipulation stuff */
    if (this.settings.get('hideToken', true)) {
      const tokenModule = getModule('hideToken');
      tokenModule.hideToken = () => void 0;
      setImmediate(() => tokenModule.showToken()); // Just to be sure
    }

    this.emit(Events.VIZALITY_INITIALIZED); // Used in src/preload/main
  }

  // Startup
  async start () {
    console.clear(); // To help achieve that pure console look ( ͡° ͜ʖ ͡°)

    // Startup banner
    console.log('%c ', `background: url('vz-asset://images/console-banner.gif') no-repeat center / contain; padding: 110px 350px; font-size: 1px; margin: 10px 0;`);

    await this.manager.apis.initialize(); // APIs

    this.settings = this.api.settings.buildCategoryObject('vz-settings');
    this.emit(Events.VIZALITY_SETTINGS_READY);

    this._patchDiscordLogs(); // This has to be after settings have been initialized

    // Setting up the modules for the global vizality object
    const modules = [ 'components', 'constants', 'discord', 'http', 'i18n', 'patcher', 'react', 'util', 'webpack' ];

    for (const mdl of modules) {
      const Mdl = await import(`@vizality/${mdl}`);
      Object.assign(this.modules, { [mdl]: Mdl });
    }

    await this.manager.builtins.initialize(); // Builtins
    await this.manager.themes.initialize(); // Themes
    await this.manager.plugins.initialize(); // Plugins

    this._initialized = true;

    const router = getModule('transitionTo');

    // This needs to be after the Webpack modules have been initialized
    router.getHistory().listen(async () => {
      const { route: { getCurrentRoute } } = await import('@vizality/discord');
      const root = document.documentElement;
      root.setAttribute('vz-route', getCurrentRoute());
    });
  }

  // Vizality shutdown
  async terminate () {
    this._initialized = false;

    this.unpatchDiscordLogs(); // Unpatch Discord's console logs

    await this.manager.plugins.terminate(); // Plugins
    await this.manager.themes.terminate(); // Themes
    await this.manager.builtins.terminate(); // Builtins
    await this.manager.apis.terminate(); // APIs
  }

  async _hookRPCServer () {
    const _this = this;

    while (!window.DiscordNative) {
      await sleep(1);
    }

    await DiscordNative.nativeModules.ensureModule('discord_rpc');
    const discordRpc = DiscordNative.nativeModules.requireModule('discord_rpc');
    const { createServer } = discordRpc.RPCWebSocket.http;
    discordRpc.RPCWebSocket.http.createServer = function () {
      _this.rpcServer = createServer();
      return _this.rpcServer;
    };
  }

  async _patchDiscordLogs () {
    const { setLogFn } = getModule('setLogFn');
    const module = 'Discord';

    if (!this.settings.get('showDiscordConsoleLogs', false)) {
      /*
       * Remove Discord's logs entirely... except the logs that don't use the function
       * i.e. normal console.logs.
       */
      setLogFn(() => void 0);
    } else {
      // Patch Discord's logs to follow Vizality's log style
      setLogFn((submodule, type, ...data) => {
        switch (type) {
          case 'info':
          case 'log':
            return log(module, submodule, null, ...data);
          case 'error':
          case 'trace':
            return error(module, submodule, null, ...data);
          case 'warn':
            return warn(module, submodule, null, ...data);
          default:
            return log(module, submodule, null, ...data);
        }
      });
    }
  }

  _patchWebSocket () {
    const _this = this;

    window.WebSocket = class PatchedWebSocket extends window.WebSocket {
      constructor (url) {
        super(url);

        this.addEventListener('message', data => {
          _this.emit(`webSocketMessage:${data.origin.slice(6)}`, data);
        });
      }
    };
  }

  async _update (force = false) {
    const success = await super._update(force);
    if (success) {
      await exec('npm install --only=prod', { cwd: this.addonPath });
      const updater = this.manager.builtins.get('vz-updater');
      // @i18n
      if (!document.querySelector('#vizality-updater, .vizality-updater')) {
        this.api.notices.sendToast('vizality-updater', {
          header: 'Update complete!',
          content: `Please click 'Reload' to complete the final stages of this Vizality update.`,
          type: 'success',
          buttons: [ {
            text: 'Reload',
            color: 'green',
            look: 'ghost',
            onClick: () => location.reload()
          }, {
            text: 'Postpone',
            color: 'grey',
            look: 'outlined',
            onClick: () => this.api.notices.closeToast('vizality-updater')
          } ]
        });
      }
      updater.settings.set('awaitingReload', true);
    }
    return success;
  }
}
