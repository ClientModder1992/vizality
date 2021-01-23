import React from 'react';

import { Events } from '@vizality/constants';
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
    this._module = 'API';
    this._submodule = 'Settings';
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

  // /**
  //  * Registers a settings tab.
  //  * @param {SettingsTab} props Props of the settings tab
  //  * @private
  //  */
  registerSettings (props) {
    try {
      let { type, addonId, render } = props;

      type = type || 'plugins';

      render =
        render?.__esModule
          ? render?.default
          : render?.type
            ? render.type
            : render;

      if (!render) {
        throw new Error(`You must specify a render component to register settings for "${addonId}"!`);
      }

      const addon = vizality.manager[type].get(addonId);

      if (!addon) {
        throw new Error(`Cannot register settings for "${addonId}" because it isn't installed!`);
      }

      addon.sections.settings = {
        component: render,
        render: this.connectStores(addonId)(render)
      };

      const Render = addon.sections.settings.render;

      vizality.api.routes.registerRoute({
        path: `/dashboard/${type}/${addonId}`,
        render: props =>
          <Layout>
            <Content
              heading='Settings'
              vz-plugin={Boolean(type === 'plugins') && addonId}
              vz-theme={Boolean(type === 'themes') && addonId}
              vz-plugin-section={Boolean(type === 'plugins') && 'settings'}
              vz-theme-section={Boolean(type === 'themes') && 'settings'}
            >
              <Render {...props} />
            </Content>
          </Layout>,
        sidebar: Sidebar
      });

      this.emit(Events.VIZALITY_SETTINGS_REGISTER, addonId);
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Registers a settings tab.
   * @param {SettingsTab} settings Props of the settings tab
   * @private
   */
  // registerSettings (settings) {
  //   try {
  //     let { type, addonId, render } = settings;

  //     type = type || 'plugins';

  //     render =
  //       render?.__esModule
  //         ? render?.default
  //         : render?.type
  //           ? render.type
  //           : render;

  //     if (!render) {
  //       throw new Error(`You must specify a render component to register settings for "${addonId}"!`);
  //     }

  //     const addon = vizality.manager[type].get(addonId);

  //     if (!addon) {
  //       throw new Error(`Cannot register settings for "${addonId}" because it isn't installed!`);
  //     }

  //     addon.sections.settings = {
  //       component: render,
  //       render: this.connectStores(addonId)(render)
  //     };

  //     this.emit(Events.VIZALITY_SETTINGS_REGISTER, addonId);
  //   } catch (err) {
  //     return this.error(err);
  //   }
  // }

  /**
   * Unregisters a settings tab.
   * @param {string} addonId Addon ID of the settings to unregister
   * @param {string} type Type of the addon
   * @private
   */
  unregisterSettings (addonId, type) {
    try {
      type = type || 'plugins';
      const addon = vizality.manager[type].get(addonId);
      if (addon?.sections?.settings) {
        delete addon.sections.settings;
      } else {
        throw new Error(`Settings for "${addonId}" are not registered, so they cannot be unregistered!`);
      }

      vizality.api.routes.unregisterRoute(`/dashboard/${type}/${addonId}`);

      this.emit(Events.VIZALITY_SETTINGS_UNREGISTER, addonId);
    } catch (err) {
      return this.error(err);
    }
  }

  /** @private */
  _registerBuiltinTab (props) {
    try {
      const { addonId, path, heading, subheading, icon, render } = props;

      const builtin = vizality.manager.builtins.get(addonId);

      builtin.sections.settings = props;
      builtin.sections.settings.render = this.connectStores(addonId)(render);

      const Render = builtin.sections.settings.render;

      vizality.api.routes.registerRoute({
        path: `/dashboard/${path}`,
        render: props =>
          <Layout>
            <Content
              heading={heading}
              subheading={subheading}
              icon={icon}
              vz-builtin={addonId}
            >
              <Render {...props} />
            </Content>
          </Layout>,
        sidebar: Sidebar
      });
    } catch (err) {
      return this.error(err);
    }
  }

  /** @private */
  _fluxProps (category) {
    return {
      settings: store.getSettings(category),
      getSetting: (setting, defaultValue) => {
        return store.getSetting(category, setting, defaultValue);
      },
      updateSetting: (setting, value) => {
        if (category === 'vz-settings') {
          this.emit(Events.VIZALITY_SETTING_UPDATE, setting, value);
        } else {
          this.emit(Events.VIZALITY_ADDON_SETTING_UPDATE, category, setting, value);
        }
        return actions.updateSetting(category, setting, value);
      },
      toggleSetting: (setting, defaultValue) => {
        if (category === 'vz-settings') {
          this.emit(Events.VIZALITY_SETTING_TOGGLE, setting, defaultValue);
        } else {
          this.emit(Events.VIZALITY_ADDON_SETTING_TOGGLE, category, setting, defaultValue);
        }
        return actions.toggleSetting(category, setting, defaultValue);
      }
    };
  }

  stop () {
    delete vizality.api.settings;
    this.removeAllListeners();
  }
}
