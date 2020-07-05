const { getModuleByPrototypes, _init } = require('vizality/webpack');
const { sleep, logger: { log, warn, error } } = require('vizality/util');
const { WEBSITE_IMAGES } = require('vizality/constants');
const { Updatable } = require('vizality/entities');

const { join } = require('path');
const { promisify } = require('util');
const cp = require('child_process');
const exec = promisify(cp.exec);

const PluginManager = require('./managers/plugins');
const StyleManager = require('./managers/styles');
const APIManager = require('./managers/apis');
const coremods = require('./coremods');
const modules = require('./modules');

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
 * @property {LabsAPI} labs
 */

/**
 * @typedef GitInfos
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
 * @property {APIManager} apiManager
 * @property {GitInfos} gitInfos
 * @property {Boolean} initialized
 */
class Vizality extends Updatable {
  constructor () {
    super(join(__dirname, '..', '..'), '', 'vizality');

    this.api = {};
    this.gitInfos = {
      upstream: '???',
      branch: '???',
      revision: '???'
    };
    this.initialized = false;
    this.styleManager = new StyleManager();
    this.pluginManager = new PluginManager();
    this.apiManager = new APIManager();
    this.hookRPCServer();
    this.patchWebSocket();

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
    this.gitInfos = await this.pluginManager.get('vz-updater').getGitInfos();

    this.emit('loaded');
  }

  // Vizality startup
  async startup () {
    console.clear();
    // Startup banner
    console.log('%c ',
      `background: url(${WEBSITE_IMAGES}/console-startup-banner.png) no-repeat center / contain; padding: 63px 242px; font-size: 1px; margin: 10px 0;`
    );

    // APIs
    await this.apiManager.startAPIs();
    this.settings = vizality.api.settings.buildCategoryObject('vz-general');
    this.emit('settingsReady');

    // Style Manager
    this.styleManager.loadThemes();

    // Plugins
    await coremods.load();
    await this.pluginManager.startPlugins();

    this.initialized = true;

    const { routes: { getCurrentRoute } } = require('vizality/discord');

    document.documentElement.setAttribute('vz-route', getCurrentRoute());

    currentWebContents.on('did-navigate-in-page', () => {
      document.documentElement.setAttribute('vz-route', getCurrentRoute());
    });

    const Log = await getModuleByPrototypes([ '_log' ]);

    const insteadObj = {};
    function _logInstead (module, orig, replace) {
      insteadObj[orig] = insteadObj[orig] || module[orig];
      module[orig] = replace;
    }

    _logInstead(Log.prototype, '_log', function (firstArg, ...originalArgs) {
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
    });
  }

  // Vizality shutdown
  async shutdown () {
    this.initialized = false;

    function _logInsteadUndo (module, orig) {
      module[orig] = this.insteadObj[orig];
    }

    _logInsteadUndo(this.Log.prototype, '_log');

    // Plugins
    await this.pluginManager.shutdownPlugins();
    await coremods.unload();

    // Style Manager
    this.styleManager.unloadThemes();

    // APIs
    await this.apiManager.unload();
  }

  // Bad code
  async hookRPCServer () {
    const _this = this;
    // eslint-disable-next-line no-unmodified-loop-condition
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

  patchWebSocket () {
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
      if (!document.querySelector('#vizality-updater, .vizality-updater')) {
        vizality.api.notices.sendToast('vizality-updater', {
          header: 'Update complete!',
          content: 'Please click "Reload" to complete the final stages of this Vizality update.',
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
