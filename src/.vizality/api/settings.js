const { logger: { error } } = require('@utilities');
const { API } = require('@entities');
const { Flux } = require('@webpack');
const { React } = require('@react');

const actions = require('./settingsStore/actions');
const store = require('./settingsStore/store');

const Sidebar = require('@root/addons/plugins/vz-dashboard/components/parts/sidebar/Sidebar');
const Layout = require('@root/addons/plugins/vz-dashboard/components/parts/Layout');

const _module = 'API';
const _submodule = 'Settings';

/* @todo: Use logger. */

/**
 * @typedef SettingsCategory
 * @property {Function} connectStore Connects a component to the settings store
 * @property {Function(String, String): String} get Gets a setting, or fallbacks to default value
 * @property {Function(): String[]} getKeys Get all settings key
 * @property {Function(String): void} delete Deletes a setting
 * @property {Function(String, String): void} set Sets a setting
 */

/**
 * @typedef SettingsTab
 * @property {string} category Settings category. Most of the time, you want this to be the entity ID
 * @property {string|function(): string} label Settings tab label
 * @property {function(): React.ReactNode} render Render method
 * @property {undefined} settings Use it and you'll be fined 69 cookies
 */

/**
 * Vizality Settings API
 * @property {Flux.Store} store Flux store
 * @property {object<string, SettingsTab>} tabs Settings tab
 */
module.exports = class SettingsAPI extends API {
  constructor () {
    super();
    this.store = store;
    this.tabs = {};
    this.toobs = [];
  }

  /**
   * Registers a settings tab
   * @param {string} tabId Settings tab ID
   * @param {SettingsTab} props Props of your settings tab
   */
  registerSettings (tabId, props) {
    if (this.tabs[tabId]) {
      throw new Error(`Settings tab ${tabId} is already registered!`);
    }
    this.tabs[tabId] = props;
    this.tabs[tabId].render = this.connectStores(props.category)(props.render);
  }

  registerDashboardSettings (tabId, props) {
    if (this.tabs[tabId]) {
      throw new Error(`Plugin settings panel "${tabId}" is already registered!`);
    }
    this.tabs[tabId] = props;
    this.tabs[tabId].render = this.connectStores(props.id)(props.render);

    vizality.api.router.registerRoute(tabId, {
      path: `/dashboard/plugins/installed/${props.id}`,
      render: () => React.createElement(Layout, {},
        React.createElement(props.render)
      )
    });
  }

  registerCoreDashboardSettings (toob) {
    try {
      if (this.toobs.find(r => r.path === toob.path)) {
        throw new Error(`Dashboard route "${toob.path}" is already registered!`);
      }

      this.toobs.push(toob);

      this.toobs[toob.id] = toob;
      this.toobs[toob.id].render = this.connectStores(toob.id)(toob.render);

      vizality.api.router.registerRoute({
        path: `/dashboard/${toob.path}`,
        render: () => React.createElement(Layout, {},
          React.createElement(toob.render)
        ),
        sidebar: Sidebar
      });
      this.emit('toobAdded', toob);
    } catch (err) {
      return error(_module, `${_submodule}:registerCoreSettings`, null, err);
    }
  }

  /**
   * Unregisters a settings tab
   * @param {string} tabId Settings tab ID to unregister
   */
  unregisterSettings (tabId) {
    if (this.tabs[tabId]) {
      delete this.tabs[tabId];
    }
  }

  /**
   * Builds a settings category that can be used by a plugin
   * @param {string} category Settings category name
   * @returns {SettingsCategory}
   */
  buildCategoryObject (category) {
    return {
      connectStore: (component) => this.connectStores(category)(component),
      getKeys: () => store.getSettingsKeys(category),
      get: (setting, defaultValue) => store.getSetting(category, setting, defaultValue),
      set: (setting, newValue) => {
        if (newValue === void 0) {
          return actions.toggleSetting(category, setting);
        }
        actions.updateSetting(category, setting, newValue);
      },
      delete: (setting) => {
        actions.deleteSetting(category, setting);
      }
    };
  }

  /**
   * Creates a flux decorator for a given settings category
   * @param {string} category Settings category
   * @returns {Function}
   */
  connectStores (category) {
    return Flux.connectStores([ this.store ], () => this._fluxProps(category));
  }

  /** @private */
  _fluxProps (category) {
    return {
      settings: store.getSettings(category),
      getSetting: (setting, defaultValue) => store.getSetting(category, setting, defaultValue),
      updateSetting: (setting, value) => actions.updateSetting(category, setting, value),
      toggleSetting: (setting, defaultValue) => actions.toggleSetting(category, setting, defaultValue)
    };
  }
};
