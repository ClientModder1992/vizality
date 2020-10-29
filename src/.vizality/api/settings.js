const { logger: { error } } = require('@util');
const { API } = require('@entities');
const { Flux } = require('@webpack');
const { React } = require('@react');

const actions = require('./settingsStore/actions');
const store = require('./settingsStore/store');

const Sidebar = require('@root/addons/plugins/vz-dashboard/components/parts/sidebar/Sidebar');
const Content = require('@root/addons/plugins/vz-dashboard/components/parts/Content');
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
   * @param {SettingsTab} props Props of the settings tab
   */
  registerSettings (tabId, props) {
    try {
      if (this.tabs[tabId]) {
        throw new Error(`Settings tab "${tabId}" is already registered!`);
      }
      this.tabs[tabId] = props;
      this.tabs[tabId].render = this.connectStores(props.category)(props.render);
      Object.freeze(this.tabs[tabId].render.prototype);
      Object.freeze(this.tabs[tabId]);
    } catch (err) {
      return error(_module, `${_submodule}:registerSettings`, null, err);
    }
  }

  registerDashboardSettings (props) {
    try {
      this.tabs[props.id] = props;
      this.tabs[props.id].render = this.connectStores(props.id)(props.render);

      const Render = this.connectStores(props.id)(props.render);

      vizality.api.router.registerRoute({
        path: `/dashboard/plugins/${props.id}`,
        render: () => React.createElement(Layout, null,
          React.createElement(Content, {
            heading: props.id
          }, React.createElement(Render, null))
        ),
        sidebar: Sidebar
      });
    } catch (err) {
      return error(_module, `${_submodule}:registerCoreSettings`, null, err);
    }
  }

  /** @private */
  registerDashboardItem (props) {
    try {
      this.tabs[props.id] = props;
      this.tabs[props.id].render = this.connectStores(props.id)(props.render);

      vizality.api.router.registerRoute({
        path: `/dashboard/${this.tabs[props.id].path}`,
        render: () => React.createElement(Layout, null,
          React.createElement(Content, {
            heading: props.header,
            subheading: props.subtext,
            icon: props.icon
          }, React.createElement(this.tabs[props.id].render, null))
        ),
        sidebar: Sidebar
      });
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
