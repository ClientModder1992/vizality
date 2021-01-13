import React from 'react';

import { toSingular } from '@vizality/util/string';
import { error } from '@vizality/util/logger';
import { Flux } from '@vizality/webpack';
import { API } from '@vizality/entities';

import actions from './store/Actions';
import store from './store/Store';

import Sidebar from '@vizality/builtins/vz-dashboard/components/parts/sidebar/Sidebar';
import Content from '@vizality/builtins/vz-dashboard/components/parts/Content';
import Layout from '@vizality/builtins/vz-dashboard/components/parts/Layout';

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
export default class Settings extends API {
  constructor () {
    super();
    this.store = store;
    this.plugins = [];
    this.themes = [];
    this._module = 'API';
    this._submodule = 'Settings';
  }

  /**
   * Registers a settings tab.
   * @param {SettingsTab} props Props of the settings tab
   */
  registerSettings (props) {
    try {
      let { type, addonId, render } = props;

      // Check if it's an ES module
      render = render.__esModule ? render.default : render;

      const addon = vizality.manager[type].get(addonId);

      addon.sections.settings = {
        component: render,
        render: this.connectStores(addonId)(render)
      };

      Object.freeze(addon.sections.settings.component.prototype);
      Object.freeze(addon.sections.settings);

      const Render = addon.sections.settings.render;

      vizality.api.router.registerRoute({
        path: `/dashboard/${type}/${addonId}`,
        render: props =>
          <Layout>
            <Content heading='Settings' className={`vz-settings-${toSingular(type)}-${addonId}`}>
              <Render {...props} />
            </Content>
          </Layout>,
        sidebar: Sidebar
      });

      // Add the addon to the list of addons with settings
      this[type].push(addonId);

      this.emit('settingsRegistered');
    } catch (err) {
      return error(this._module, `${this._submodule}:registerCoreSettings`, null, err);
    }
  }

  /**
   * Unregisters a settings tab.
   * @param {string} addonId Addon ID of the settings to unregister
   * @param {string} type Type of the addon
   */
  unregisterSettings (addonId, type) {
    type = type || 'plugins';

    try {
      const addon = vizality.manager[type].get(addonId);
      if (addon?.sections?.settings) {
        delete addon.sections.settings;
      } else {
        throw new Error(`Settings for "${addonId}" are not registered, so they cannot be unregistered!`);
      }

      vizality.api.router.unregisterRoute(`/dashboard/${type}/${addonId}`);

      // Remove the addon from the list of addons with settings
      this[type].splice(this[type].indexOf(addonId), 1);
      this.emit('settingsUnregistered');
    } catch (err) {
      return error(this._module, `${this._submodule}:_unregisterAddonSettings`, null, err);
    }
  }

  /** @private */
  _registerBuiltinSettings (props) {
    try {
      const { addonId, path, heading, subheading, icon, render } = props;

      const builtin = vizality.manager.builtins.get(addonId);

      builtin.sections.settings = props;
      builtin.sections.settings.render = this.connectStores(addonId)(render);

      const Render = builtin.sections.settings.render;

      vizality.api.router.registerRoute({
        path: `/dashboard/${path}`,
        render: props =>
          <Layout>
            <Content heading={heading} subheading={subheading} icon={icon} className={`vz-builtin-${addonId}`}>
              <Render {...props} />
            </Content>
          </Layout>,
        sidebar: Sidebar
      });

      this.emit('builtinSettingsRegistered');
    } catch (err) {
      return error(this._module, `${this._submodule}:_registerBuiltinSettings`, null, err);
    }
  }

  /**
   * Builds a settings category that can be used by a plugin.
   * @param {string} category Settings category name
   * @returns {SettingsCategory}
   */
  buildCategoryObject (category) {
    return {
      connectStore: component => this.connectStores(category)(component),
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
   * Creates a flux decorator for a given settings category.
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
}
