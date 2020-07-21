const { Updatable } = require('@entities');
const { jsx: JsxCompiler } = require('@compilers');
const { getModule, getModuleByPrototypes, _init } = require('@webpack');
const { sleep, logger: { log, warn, error } } = require('@util');
const { IMAGES, ROOT_FOLDER } = require('@constants');

const { join } = require('path');
const { promisify } = require('util');
const cp = require('child_process');
const exec = promisify(cp.exec);

const PluginManager = require('./managers/pluginManager');
const StyleManager = require('./managers/styleManager');
const APIManager = require('./managers/apiManager');

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
 * @property {StyleManager} styleManager
 * @property {PluginManager} pluginManager
 * @property {APIManager} _apiManager
 * @property {Git} git
 * @property {Boolean} _initialized
 */
class Vizality extends Updatable {
  constructor () {
    super(ROOT_FOLDER, '', 'vizality');

    this.api = {};
    this.git = {
      upstream: '???',
      branch: '???',
      revision: '???'
    };

    this.styleManager = new StyleManager();
    this.pluginManager = new PluginManager();

    this._initialized = false;
    this._apiManager = new APIManager();
    this._originalLogFunc = {};
    this._hookRPCServer();
    this._patchWebSocket();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  // Vizality initialization
  async init () {
    const isOverlay = (/overlay/).test(location.pathname);
    if (isOverlay) { // eh
      // await sleep(250);
    }
    await sleep(1e3);

    // Webpack & Modules
    await _init();
    await Promise.all(modules.map(mdl => mdl()));

    // Start
    await this.startup();
    this.git = await this.pluginManager.get('vz-updater')._getGitInfo();

    this.emit('loaded');
  }

  // Vizality startup
  async startup () {
    // To achieve that pure console look ( ͡° ͜ʖ ͡°)
    // console.clear();
    console.log(ROOT_FOLDER, '', 'vizality');

    const startupBanner = `${IMAGES}/console-startup-banner.png`;

    // Startup banner
    console.log('%c ', `background: url(${startupBanner}) no-repeat center / contain; padding: 63px 242px; font-size: 1px; margin: 10px 0;`);

    // APIs
    await this._apiManager.startAPIs();
    this.settings = vizality.api.settings.buildCategoryObject('vz-general');
    this.emit('settingsReady');

    // @todo: Make this and _removeDiscordLogs settings options

    // Patch Discord's console logs
    /*
     * this._patchDiscordLogs();
     */

    // Remove Discord's console logs
    this._removeDiscordLogs();

    // Style Manager
    this.styleManager.loadThemes();

    // Plugins
    await this.pluginManager.startPlugins();

    this._initialized = true;

    // This needs to be here, after the Webpack modules have been initialized
    const { routes: { getCurrentRoute } } = require('@discord');

    document.documentElement.setAttribute('vz-route', getCurrentRoute());

    currentWebContents.on('did-navigate-in-page', () => {
      document.documentElement.setAttribute('vz-route', getCurrentRoute());
    });
  }

  // Vizality shutdown
  async shutdown () {
    this._initialized = false;

    // Unpatch Discord's console logs
    this._unpatchDiscordLogs();

    // Plugins
    await this.pluginManager.shutdownPlugins();

    // Style Manager
    this.styleManager.unloadThemes();

    // APIs
    await this._apiManager.unload();
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
  _patchDiscordLogs () {
    const Log = getModuleByPrototypes([ '_log' ]);

    this._originalLogFunc._log = this._originalLogFunc._log || Log.prototype._log;
    Log.prototype._log = function (firstArg, ...originalArgs) {
      const MODULE = 'Discord';
      const SUBMODULE = this.name;

      if (firstArg === 'info' || firstArg === 'log') {
        log(MODULE, SUBMODULE, null, ...originalArgs);
      }

      if (firstArg === 'error' || firstArg === 'trace') {
        error(MODULE, SUBMODULE, null, ...originalArgs);
      }

      if (firstArg === 'warn') {
        warn(MODULE, SUBMODULE, null, ...originalArgs);
      }
    };
  }

  // Remove Discord's logs entirely
  _removeDiscordLogs () {
    const Log = getModuleByPrototypes([ '_log' ]);

    this._originalLogFunc._log = this._originalLogFunc._log || Log.prototype._log;
    // eslint-disable-next-line no-empty-function
    Log.prototype._log = function () { };
  }

  // Unpatch Discord's logs back to the default style
  _unpatchDiscordLogs () {
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
      const updater = this.pluginManager.get('vz-updater');
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
