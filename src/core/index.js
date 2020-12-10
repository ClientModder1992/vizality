const { promisify } = require('util');
const cp = require('child_process');
const exec = promisify(cp.exec);

const { sleep, logger: { log, warn, error } } = require('@vizality/util');
const { getModule, initialize } = require('@vizality/webpack');
const { HTTP, Directories } = require('@vizality/constants');
const { jsx: JsxCompiler } = require('@vizality/compilers');
const { Updatable } = require('@vizality/entities');

const AddonManager = require('./managers/addon');
const ThemeManager = require('./managers/addon/theme');
const BuiltinManager = require('./managers/addon/builtin');
const PluginManager = require('./managers/addon/plugin');
const APIManager = require('./managers/api');

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
module.exports = class Vizality extends Updatable {
  constructor () {
    super(Directories.ROOT, '', 'vizality');

    /*
     * Copy over the VizalityNative to vizality.native and then delete
     * VizalityNative, so that we are staying consistent and only have
     * one top level global variable.
     */
    this.native = global.VizalityNative;
    delete global.VizalityNative;

    this.api = {};
    this.modules = {};
    this.manager = {};
    this.git = {
      upstream: '???',
      branch: '???',
      revision: '???'
    };

    this.manager.apis = new APIManager();
    this.manager.themes = new ThemeManager();
    this.manager.builtins = new BuiltinManager();
    this.manager.plugins = new PluginManager();

    this._initialized = false;
    this._originalLogFunc = {};
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

    // Webpack & Modules
    await initialize();

    const FluxModule = async () => {
      const Flux = getModule('Store', 'PersistedStore');
      Flux.connectStoresAsync = (stores, fn) => (Component) =>
        require('@vizality/components').AsyncComponent.from((async () => {
          const awaitedStores = await Promise.all(stores);
          console.log('Remember to add these to settings (darkSiderbar, etc.)', awaitedStores);
          return Flux.connectStores(awaitedStores, (props) => fn(awaitedStores, props))(Component);
        })());
    };

    const JsxCompilerModule = async () => {
      require.extensions['.jsx'] = (module, filename) => {
        const compiler = new JsxCompiler(filename);
        const compiled = compiler.compile();
        module._compile(compiled, filename);
      };
    };

    const modules = [ FluxModule, JsxCompilerModule ];

    await Promise.all(modules.map(mdl => mdl()));

    // Start
    await this.start();
    this.git = await this.manager.builtins.get('updater').getGitInfo();

    // Token manipulation stuff
    if (this.settings.get('hideToken', true)) {
      const tokenModule = await require('@vizality/webpack').getModule('hideToken');
      tokenModule.hideToken = () => void 0;
      setImmediate(() => tokenModule.showToken()); // just to be sure
    }

    // Used in src/preload/main
    this.emit('initialized');
  }

  // Startup
  async start () {
    // To help achieve that pure console look ( ͡° ͜ʖ ͡°)
    console.clear();

    // Startup banner
    console.log('%c ', `background: url('${HTTP.IMAGES}/console-banner.png') no-repeat center / contain; padding: 115px 345px; font-size: 1px; margin: 10px 0;`);

    // APIs
    await this.manager.apis.initialize();
    this.settings = vizality.api.settings.buildCategoryObject('settings');
    this.emit('settingsReady');

    // @todo: Make this and removeDiscordLogs settings options

    // Patch Discord's console logs
    // this.patchDiscordLogs();

    // Remove Discord's console logs
    this.removeDiscordLogs();

    // Setting up the modules for the global vizality object
    const modules = [ 'webpack', 'classes', 'constants', 'discord', 'util' ];

    for (const mdl of modules) {
      const Mdl = require(`@vizality/${mdl}`);
      Object.assign(this.modules, { [mdl]: Mdl });
    }

    /*
     * const Webpack = require('@vizality/webpack');
     * Object.getOwnPropertyNames(Webpack)
     *   .forEach(e => {
     *     if (!e.indexOf('get') || !e.indexOf('find') || !e.indexOf('_')) {
     *       Modules.webpack[e] = Webpack[e];
     *     } else {
     *       Modules.webpack.modules[e] = Webpack[e];
     *     }
     *   });
     */

    // Builtins
    await this.manager.builtins.load();

    // Themes
    this.manager.themes.load();

    // Plugins
    await this.manager.plugins.load();

    this._initialized = true;

    /**
     *
     *
     * @returns {*}
     */
    // (() => {
    //   const { wrapper } = getModule('wrapper', 'unreadMentionsBar');
    //   const { listItem } = getModule('guildsError', 'selected');
    //   const { blobContainer } = getModule('blobContainer');
    //   return new Promise(resolve => {
    //     const checkForGuilds = () => {
    //       if (document.querySelectorAll(`.${wrapper} .${listItem} .${blobContainer}`).length > 0) {
    //         return resolve(vizality.api.router.navigate('dashboard'));
    //       }
    //       setTimeout(checkForGuilds, 100);
    //     };
    //     setTimeout(checkForGuilds, 100);
    //   });
    // })();

    const router = getModule('transitionTo');

    // This needs to be here, after the Webpack modules have been initialized
    router.getHistory().listen(() => {
      const { route: { getCurrentRoute } } = require('@vizality/discord');
      document.documentElement.setAttribute('vz-route', getCurrentRoute());
    });
  }

  // Vizality shutdown
  async stop () {
    this._initialized = false;

    // Unpatch Discord's console logs
    this.unpatchDiscordLogs();

    // Plugins
    await this.manager.plugins.terminate();

    // Style Manager
    this.manager.themes.terminate();

    // APIs
    await this.manager.apis.unload();
  }

  // Bad code
  async _hookRPCServer () {
    const _this = this;

    while (!global.DiscordNative) {
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

  // Patch Discord's logs to follow Vizality's log style
  patchDiscordLogs () {
  }

  // Remove Discord's logs entirely
  removeDiscordLogs () {
    const { setLogFn } = getModule('setLogFn');
    setLogFn(() => void 0);
  }

  // Unpatch Discord's logs back to the default style
  unpatchDiscordLogs () {
  }

  _patchWebSocket () {
    const _this = this;

    window.WebSocket = class PatchedWebSocket extends window.WebSocket {
      constructor (url) {
        super(url);

        this.addEventListener('message', (data) => {
          _this.emit(`webSocketMessage:${data.origin.slice(6)}`, data);
        });
      }
    };
  }

  async _update (force = false) {
    const success = await super._update(force);
    if (success) {
      await exec('npm install --only=prod', { cwd: this.addonPath });
      const updater = this.manager.builtins.get('updater');
      // @i18n
      if (!document.querySelector('#vizality-updater, .vizality-updater')) {
        vizality.api.notices.sendToast('vizality-updater', {
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
            look: 'outlined'
          } ]
        });
      }
      updater.settings.set('awaiting_reload', true);
    }
    return success;
  }
};
