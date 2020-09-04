const { getModule, getModuleByPrototypes, initialize } = require('@webpack');
const { sleep, logger: { log, warn, error } } = require('@util');
const { HTTP, Directories } = require('@constants');
const { jsx: JsxCompiler } = require('@compilers');
const { Updatable } = require('@entities');

const { promisify } = require('util');
const cp = require('child_process');
const exec = promisify(cp.exec);

const AddonManager = require('./managers/addon');
const StyleManager = require('./managers/styleManager');
const APIManager = require('./managers/api');

const FluxModule = async () => {
  const Flux = getModule('Store', 'PersistedStore');
  Flux.connectStoresAsync = (stores, fn) => (Component) =>
    require('@components').AsyncComponent.from((async () => {
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

const currentWebContents = require('electron').remote.getCurrentWebContents();

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
class Vizality extends Updatable {
  constructor () {
    super(Directories.ROOT, '', 'vizality');

    this.api = {};
    this.modules = {};
    this.manager = {};
    this.git = {
      upstream: '???',
      branch: '???',
      revision: '???'
    };

    this.styleManager = new StyleManager();
    this.manager.apis = new APIManager();
    this.manager.themes = new AddonManager('themes', Directories.THEMES);
    this.manager.plugins = new AddonManager('plugins', Directories.PLUGINS);

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
    await sleep(1e3);

    // Webpack & Modules
    await initialize();
    await Promise.all(modules.map(mdl => mdl()));

    // Start
    await this.start();
    this.git = await this.manager.plugins.get('vz-updater').getGitInfo();

    // Used in src/preload/main
    this.emit('initialized');
  }

  // Startup
  async start () {
    // To help achieve that pure console look ( ͡° ͜ʖ ͡°)
    // console.clear();

    const startupBanner = `${HTTP.IMAGES}/console-startup-banner.gif`;

    // Startup banner
    console.log('%c ', `background: url(${startupBanner}) no-repeat center / contain; padding: 115px 345px; font-size: 1px; margin: 10px 0;`);

    // APIs
    await this.manager.apis.initialize();
    this.settings = vizality.api.settings.buildCategoryObject('vz-settings');
    this.emit('settingsReady');

    // @todo: Make this and removeDiscordLogs settings options

    // Patch Discord's console logs
    // this.patchDiscordLogs();

    // Remove Discord's console logs
    this.removeDiscordLogs();

    // Setting up the modules for the global vizality object
    const modules = [ 'webpack', 'classes', 'constants', 'discord', 'util' ];

    for (const mdl of modules) {
      const Mdl = require(`@${mdl}`);
      Object.assign(this.modules, { [mdl]: Mdl });
    }

    /*
     * const Webpack = require('@webpack');
     * Object.getOwnPropertyNames(Webpack)
     *   .forEach(e => {
     *     if (!e.indexOf('get') || !e.indexOf('find') || !e.indexOf('_')) {
     *       Modules.webpack[e] = Webpack[e];
     *     } else {
     *       Modules.webpack.modules[e] = Webpack[e];
     *     }
     *   });
     */

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
    (() => {
      const { wrapper } = getModule('wrapper', 'unreadMentionsBar');
      const { listItem } = getModule('guildsError', 'selected');
      const { blobContainer } = getModule('blobContainer');
      return new Promise(resolve => {
        const checkForGuilds = () => {
          if (document.querySelectorAll(`.${wrapper} .${listItem} .${blobContainer}`).length > 0) {
            return resolve(vizality.api.router.go('/dashboard'));
          }
          setTimeout(checkForGuilds, 100);
        };
        setTimeout(checkForGuilds, 100);
      });
    })();

    // This needs to be here, after the Webpack modules have been initialized
    const { route: { getCurrentRoute } } = require('@discord');

    document.documentElement.setAttribute('vz-route', getCurrentRoute());

    currentWebContents.on('did-navigate-in-page', () => {
      document.documentElement.setAttribute('vz-route', getCurrentRoute());
    });
  }

  // Vizality shutdown
  async stop () {
    this._initialized = false;

    // Unpatch Discord's console logs
    this.unpatchDiscordLogs();

    // Plugins
    await this.manager.plugins.unload();

    // Style Manager
    this.manager.themes.unload();

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
    const Log = getModuleByPrototypes([ '_log' ]);

    this._originalLogFunc._log = this._originalLogFunc._log || Log.prototype._log;
    Log.prototype._log = function (firstArg, ...originalArgs) {
      const module = 'Discord';
      const submodule = this.name;

      if (firstArg === 'info' || firstArg === 'log') {
        log(module, submodule, null, ...originalArgs);
      }

      if (firstArg === 'error' || firstArg === 'trace') {
        error(module, submodule, null, ...originalArgs);
      }

      if (firstArg === 'warn') {
        warn(module, submodule, null, ...originalArgs);
      }
    };
  }

  // Remove Discord's logs entirely
  removeDiscordLogs () {
    const Log = getModuleByPrototypes([ '_log' ]);

    this._originalLogFunc._log = this._originalLogFunc._log || Log.prototype._log;
    // eslint-disable-next-line no-empty-function
    Log.prototype._log = function () { };
  }

  // Unpatch Discord's logs back to the default style
  unpatchDiscordLogs () {
    const Log = getModuleByPrototypes([ '_log' ]);
    Log.prototype._log = vizality._originalLogFunc._log;
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
      await exec('npm install --only=prod', { cwd: this.entityPath });
      const updater = this.manager.plugins.get('vz-updater');
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
}

module.exports = Vizality;
