/* eslint-disable brace-style *//* eslint-disable no-unused-vars *//* eslint-disable jsdoc/no-undefined-types */
const childProcess = require('child_process');
const util = require('util');
const __typings__ = require('@typings');
const Constants = require('@constants');
const Updatable = require('@updatable');
const Compilers = require('@compilers');
const Webpack = require('@webpack');
const { Misc: { sleep } } = require('@util');

const exec = util.promisify(childProcess.exec);

const AddonManager = require('./managers/addon');
const StyleManager = require('./managers/styleManager');
const APIManager = require('./managers/api');

const FluxModule = async () => {
  const Flux = Webpack.getModule('Store', 'PersistedStore');
  Flux.connectStoresAsync = (stores, fn) => (Component) =>
    require('@components').AsyncComponent.from((async () => {
      const awaitedStores = await Promise.all(stores);
      console.log('Remember to add these to settings (darkSiderbar, etc.)', awaitedStores);
      return Flux.connectStores(awaitedStores, (props) => fn(awaitedStores, props))(Component);
    })());
};

const JsxCompilerModule = async () => {
  require.extensions['.jsx'] = (module, filename) => {
    const compiler = new Compilers.jsx(filename);
    const compiled = compiler.compile();
    module._compile(compiled, filename);
  };
};

const modules = [ FluxModule, JsxCompilerModule ];

const currentWebContents = require('electron').remote.getCurrentWebContents();

/**
 * Main Vizality class
 * @type {Vizality}
 * @property {VizalityAPI} api
 * @property {AddonManager} manager
 * @property {VizalityModules} modules
 * @property {Git} git
 * @property {boolean} _ready
 * @property {APIManager} _apiManager
 */
module.exports = class Vizality extends Updatable {
  constructor () {
    super(Constants.Directories.ROOT, '', 'vizality');

    this.api = {};
    this.modules = {};
    this.manager = {};
    this.git = { upstream: '???', branch: '???', revision: '???' };

    this.styleManager = new StyleManager();
    this.manager.apis = new APIManager();
    this.manager.themes = new AddonManager('themes', Constants.Directories.THEMES);
    this.manager.plugins = new AddonManager('plugins', Constants.Directories.PLUGINS);

    this._ready = false;
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
    // const isOverlay = (/overlay/).test(location.pathname);

    await sleep(1e3);

    // Webpack & Modules
    await Webpack.initialize();
    await Promise.all(modules.map(mdl => mdl()));

    // Start
    await this.start();

    this.git = await this.manager.plugins.get('vz-updater').getGitInfo();

    // Used in src/preload/main
    this.emit('initialized');
  }

  // Startup
  async start () {
    // console.clear(); // To help achieve that pure console look ( ͡° ͜ʖ ͡°)
    const startupBanner = `${Constants.HTTP.IMAGES}/console-startup-banner.gif`;
    // Startup banner
    console.log('%c ', `background: url(${startupBanner}) no-repeat center / contain; padding: 116px 350px; font-size: 1px; margin: 10px 0;`);

    // APIs
    await this.manager.apis.initialize();
    this.settings = vizality.api.settings.buildCategoryObject('vz-general');
    this.emit('settingsReady');

    // @todo: Make this and _removeDiscordLogs settings options

    /*
     * Patch Discord's console logs
     * this._patchDiscordLogs();
     */

    // Remove Discord's console logs
    this._removeDiscordLogs();

    // Setting up the modules for the global vizality object
    const modules = [ 'webpack', 'classes', 'constants', 'localize', 'discord', 'util' ];

    for (const mdl of modules) {
      const Mdl = require(`@${mdl}`);
      Object.assign(this.modules, { [mdl]: Mdl });
    }

    this.manager.themes.load(); // Themes
    await this.manager.plugins.load(); // Plugins

    this._ready = true;

    // This needs to be here, after the Webpack modules have been initialized
    const { route: { getCurrentRoute } } = require('@discord');

    document.documentElement.setAttribute('vz-route', getCurrentRoute());

    currentWebContents.on('did-navigate-in-page', () => {
      document.documentElement.setAttribute('vz-route', getCurrentRoute());
    });
  }

  // Vizality shutdown
  async stop () {
    this._ready = false;

    // Unpatch Discord's console logs
    this._unpatchDiscordLogs();

    await this.manager.plugins.unload(); // Plugins
    this.manager.themes.unload(); // Themes
    await this.manager.apis.unload(); // APIs
  }

  // Bad code
  async _hookRPCServer () {
    const _this = this;

    while (!global.DiscordNative) await sleep(1);

    await DiscordNative.nativeModules.ensureModule('discord_rpc');
    const discordRpc = DiscordNative.nativeModules.requireModule('discord_rpc');
    const { createServer } = discordRpc.RPCWebSocket.http;

    discordRpc.RPCWebSocket.http.createServer = () => {
      _this.rpcServer = createServer();
      return _this.rpcServer;
    };
  }

  // Patch Discord's logs to follow Vizality's log style
  _patchDiscordLogs () {
    const Log = Webpack.getModuleByPrototypes([ '_log' ]);

    this._originalLogFunc._log = this._originalLogFunc._log || Log.prototype._log;
    Log.prototype._log = function (type, ...originalArgs) {
      const module = 'Discord';
      const submodule = this.name;

      if (type === 'info' || type === 'log') {
        Util.Logger.log(module, submodule, null, ...originalArgs);
      }

      if (type === 'error' || type === 'trace') {
        Util.Logger.error(module, submodule, null, ...originalArgs);
      }

      if (type === 'warn') {
        Util.Logger.warn(module, submodule, null, ...originalArgs);
      }
    };
  }

  // Remove Discord's logs entirely
  _removeDiscordLogs () {
    const Log = Webpack.getModuleByPrototypes([ '_log' ]);

    this._originalLogFunc._log = this._originalLogFunc._log || Log.prototype._log;
    // eslint-disable-next-line no-empty-function
    Log.prototype._log = function () { };
  }

  // Unpatch Discord's logs back to the default style
  _unpatchDiscordLogs () {
    const Log = Webpack.getModuleByPrototypes([ '_log' ]);
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
};
