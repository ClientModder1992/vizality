const { API } = require('@entities');
const { get, put } = require('@http');
const { Flux } = require('@webpack');
const { WEBSITE } = require('@constants');

const { randomBytes, scryptSync, createCipheriv, createDecipheriv } = require('crypto');

const store = require('./settingsStore/store');
const actions = require('./settingsStore/actions');

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
 * @property {String} category Settings category. Most of the time, you want this to be the entity ID
 * @property {String|function(): String} label Settings tab label
 * @property {function(): React.ReactNode} render Render method
 * @property {undefined} settings Use it and you'll be fined 69 cookies
 */

/**
 * Vizality Settings API
 * @property {Flux.Store} store Flux store
 * @property {Object.<String, SettingsTab>} tabs Settings tab
 */
class SettingsAPI extends API {
  constructor () {
    super();

    this.store = store;
    this.tabs = {};
  }

  /**
   * Registers a settings tab
   * @param {String} tabId Settings tab ID
   * @param {SettingsTab} props Props of your settings tab
   */
  registerSettings (tabId, props) {
    if (this.tabs[tabId]) {
      throw new Error(`Settings tab ${tabId} is already registered!`);
    }
    this.tabs[tabId] = props;
    this.tabs[tabId].render = this.connectStores(props.category)(props.render);
  }

  /**
   * Unregisters a settings tab
   * @param {String} tabId Settings tab ID to unregister
   */
  unregisterSettings (tabId) {
    if (this.tabs[tabId]) {
      delete this.tabs[tabId];
    }
  }

  /**
   * Builds a settings category that can be used by a plugin
   * @param {String} category Settings category name
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
   * @param {String} category Settings category
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
}

module.exports = SettingsAPI;
