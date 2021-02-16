import { promisify } from 'util';
import cp from 'child_process';
import { join } from 'path';

import { Directories, Developers, Events } from '@vizality/constants';
import { _initializeModules, getModule } from '@vizality/webpack';
import { log, warn, error } from '@vizality/util/logger';
import { resolveCompiler } from '@vizality/compilers';
import { createElement } from '@vizality/util/dom';
import { Updatable } from '@vizality/entities';
import { sleep } from '@vizality/util/time';

import BuiltinManager from './managers/Builtin';
import PluginManager from './managers/Plugin';
import ThemeManager from './managers/Theme';
import APIManager from './managers/API';

const exec = promisify(cp.exec);

export default class Vizality extends Updatable {
  constructor () {
    super(Directories.ROOT, '', 'vizality');
    delete this.addonId; // Leftover prop from Updatable

    /*
     * @note Copy over the VizalityNative to vizality.native and then delete
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
    // Webpack & Modules
    await _initializeModules();

    // Set up connectStoresAsync
    const Flux = getModule('Store', 'PersistedStore');
    Flux.connectStoresAsync = (stores, fn) => Component =>
      require('@vizality/components').AsyncComponent.from((async () => {
        const awaitedStores = await Promise.all(stores);
        // @todo Remember to add these to settings (darkSiderbar, etc.): awaitedStores
        return Flux.connectStores(awaitedStores, props => fn(awaitedStores, props))(Component);
      })());

    // Start
    await this.start();
    this.git = await this.manager.builtins.get('vz-updater').getGitInfo();

    // Token manipulation stuff
    if (this.settings.get('hideToken', true)) {
      const tokenModule = getModule('hideToken');
      tokenModule.hideToken = () => void 0;
      // Just to be sure
      setImmediate(() => tokenModule.showToken());
    }

    // Used in src/preload/main
    this.emit(Events.VIZALITY_INITIALIZE);
  }

  // Startup
  async start () {
    // To help achieve that pure console look ( ͡° ͜ʖ ͡°)
    console.clear();

    // Startup banner
    console.log('%c ',
      `background: url('vz-asset://image/console-banner.gif') no-repeat center / contain;
       padding: 110px 350px;
       font-size: 1px;
       margin: 10px 0;`
    );

    // Initialize APIs
    await this.manager.apis.initialize();

    // Initialize Vizality core settings
    this.settings = this.api.settings.buildCategoryObject('vz-settings');
    this.emit(Events.VIZALITY_SETTINGS_READY);

    // Check if the current user is a verified Vizality Developer
    const { getId: currentUserId } = getModule('initialize', 'getFingerprint');
    if (Developers.includes(currentUserId())) {
      this.settings.set('verifiedVizalityDeveloper', true);
    }

    // This has to be after settings have been initialized
    this._patchDiscordLogs();

    // Set up the modules for the global vizality object
    const modules = await import('@vizality/modules');
    for (const mdl of Object.keys(modules)) {
      Object.assign(this.modules, { [mdl]: modules[mdl] });
    }

    // Inject main Vizality styles
    this._injectMainStyles();

    // Initialize builtins, plugins, and themes
    await this.manager.builtins.initialize(); // Builtins
    await this.manager.plugins.initialize(); // Plugins
    await this.manager.themes.initialize(); // Themes

    // Set up shorthand global object
    window.$vz = Object.assign({}, vizality.manager, vizality.api, vizality.modules);

    this._initialized = true;
  }

  // Vizality shutdown
  async terminate () {
    this._initialized = false;

    await this.manager.themes.terminate(); // Themes
    await this.manager.plugins.terminate(); // Plugins
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
      _this.rpc = createServer();
      return _this.rpc;
    };
  }

  async _patchDiscordLogs () {
    const { setLogFn } = getModule('setLogFn');
    const module = 'Discord';
    if (!this.settings.get('showDiscordConsoleLogs', false)) {
      /*
       * Removes Discord's logs entirely... except the logs that don't use the function
       * i.e. normal console.logs.
       */
      setLogFn(() => void 0);
    } else {
      // Patch Discord's logs to follow Vizality's log style
      setLogFn((submodule, type, ...data) => {
        switch (type) {
          case 'info':
          case 'log':
            return log({ module, submodule }, ...data);
          case 'error':
          case 'trace':
            return error({ module, submodule }, ...data);
          case 'warn':
            return warn({ module, submodule }, ...data);
          default:
            return log({ module, submodule }, ...data);
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
    try {
      const success = await super._update(force);
      if (success) {
        try {
          await exec('npm install --only=prod --legacy-peer-deps', { cwd: this.dir });
        } catch (err) {
          return this._error(`An error occurred while updating Vizality's dependencies!`, err);
        }

        const updater = this.manager.builtins.get('vz-updater');
        // @i18n
        if (!document.querySelector(`#vz-updater-update-complete, [vz-route='updater']`)) {
          this.api.notices.sendToast('vz-updater-update-complete', {
            header: 'Update complete!',
            content: `Please click 'Reload' to complete the final stages of this Vizality update.`,
            type: 'success',
            buttons: [
              {
                text: 'Reload',
                color: 'green',
                look: 'ghost',
                onClick: () => DiscordNative.app.relaunch()
              },
              {
                text: 'Postpone',
                color: 'grey',
                look: 'outlined',
                onClick: () => this.api.notices.closeToast('vz-updater-update-complete')
              }
            ]
          });
        }
        updater.settings.set('awaitingReload', true);
      }
      return success;
    } catch (err) {
      return this._error(`An error occurred while updating Vizality!`, err);
    }
  }

  /**
   * Injects a style element containing Vizality's core styles.
   */
  _injectMainStyles () {
    const path = join(__dirname, 'styles', 'main.scss');
    const id = Math.random().toString(36).slice(2);
    const compiler = resolveCompiler(path);
    const style = createElement('style', {
      id: 'vizality-core-styles',
      'vz-style': ''
    });

    document.head.appendChild(style);

    const compile = async () => {
      style.innerHTML = await compiler.compile();
    };

    if (this.settings.get('verifiedVizalityDeveloper', false)) {
      compiler.enableWatcher();
      compiler.on('src-update', compile);
      this[`__compileStylesheet_${id}`] = compile;
      this[`__compiler_${id}`] = compiler;
      return compile();
    }

    return compile();
  }

  /** @private */
  _log (...data) { log({ module: this.constructor.name, submodule: 'Core' }, ...data); }
  _warn (...data) { warn({ module: this.constructor.name, submodule: 'Core' }, ...data); }
  _error (...data) { error({ module: this.constructor.name, submodule: 'Core' }, ...data); }
}
