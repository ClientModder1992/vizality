const { randomBytes, scryptSync, createCipheriv, createDecipheriv } = require('crypto');
const { React, Flux, getModuleByDisplayName } = require('powercord/webpack');
const { AsyncComponent } = require('powercord/components');
const { WEBSITE } = require('powercord/constants');
const { get, put } = require('powercord/http');
const { API } = require('powercord/entities');

const store = require('./store');
const actions = require('./store/actions');

const ErrorBoundary = require('./ErrorBoundary');
const FormTitle = AsyncComponent.from(getModuleByDisplayName('FormTitle'));
const FormSection = AsyncComponent.from(getModuleByDisplayName('FormSection'));

module.exports = class SettingsAPI extends API {
  constructor () {
    super();

    this.ErrorBoundary = ErrorBoundary;
    this.actions = actions;
    this.store = store;
    this.tabs = [];
  }

  async apiWillUnload () {
    clearInterval(this._interval);
  }

  // Categories
  registerTab (pluginID, section, displayName, render, connectStore = true) {
    if (!section.match(/^[a-z0-9_-]+$/i)) {
      return this.error(`Tried to register a settings panel with an invalid ID! You can only use letters, numbers, dashes and underscores. (ID: ${section})`);
    }

    if (this.tabs.find(s => s.section === section)) {
      return this.error(`Key ${section} is already used by another plugin!`);
    }

    this.tabs.push({
      section,
      label: displayName,
      element: this._renderSettingsPanel.bind(this, displayName, connectStore ? this._connectStores(pluginID)(render) : render)
    });
  }

  unregisterTab (section) {
    this.tabs = this.tabs.filter(s => s.section !== section);
  }

  buildCategoryObject (category) {
    return {
      connectStore: (component) => this._connectStores(category)(component),
      get: (setting, defaultValue) => powercord.api.settings.store.getSetting(category, setting, defaultValue),
      getKeys: () => powercord.api.settings.store.getSettingsKeys(category),
      delete: (setting) => powercord.api.settings.actions.deleteSetting(category, setting),
      set: (setting, newValue) => {
        if (newValue === void 0) {
          return powercord.api.settings.actions.toggleSetting(category, setting);
        }
        powercord.api.settings.actions.updateSetting(category, setting, newValue);
      }
    };
  }

  // React + Flux
  _connectStores (category) {
    return Flux.connectStores([ this.store ], this._fluxProps.bind(this, category));
  }

  _fluxProps (category) {
    return {
      settings: this.store.getSettings(category),
      getSetting: (setting, defaultValue) => this.store.getSetting(category, setting, defaultValue),
      updateSetting: (setting, value) => this.actions.updateSetting(category, setting, value),
      toggleSetting: (setting, defaultValue) => this.actions.toggleSetting(category, setting, defaultValue)
    };
  }

  _renderSettingsPanel (title, contents) {
    let panelContents;
    try {
      panelContents = React.createElement(contents);
    } catch (e) {
      this.error('Failed to render settings panel, check if your function returns a valid React component!');
      panelContents = null;
    }

    const h2 = React.createElement(FormTitle, { tag: 'h2' }, typeof title === 'function' ? title() : title);
    return React.createElement(ErrorBoundary, null, React.createElement(FormSection, {}, h2, panelContents));
  }

  get localStorage () {
    const { localStorage } = window;
    const blacklist = [
      'APPLICATION_RPC_RESPONSE', 'deviceProperties', 'email_cache',
      'gatewayURL', 'referralProperties', 'token', 'user_id_cache'
    ];

    const items = {};

    for (const item in localStorage) {
      if (localStorage.hasOwnProperty(item) && !blacklist.includes(item)) {
        items[item] = JSON.parse(localStorage[item]);
      }
    }

    return { items };
  }
};
