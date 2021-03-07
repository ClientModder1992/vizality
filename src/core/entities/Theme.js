import { toPlural, toKebabCase } from '@vizality/util/string';
import { log, warn, error } from '@vizality/util/logger';
import { resolveCompiler } from '@vizality/compilers';
import { createElement } from '@vizality/util/dom';
import { jsonToReact } from '@vizality/util/react';
import { Directories } from '@vizality/constants';
import { isArray } from '@vizality/util/array';
import { debounce } from 'lodash';

import Updatable from './Updatable';

/**
 * @todo Finish writing this.
 * Main class for Vizality themes.
 * @typedef VizalityTheme
 * @extends Updatable
 * @extends Events
 */
export default class Theme extends Updatable {
  constructor (addonId, manifest) {
    super(Directories.THEMES, addonId);
    this.settings = vizality.api.settings.buildCategoryObject(this.addonId);
    this.compiler = resolveCompiler(manifest.effectiveTheme);
    this.manifest = manifest;
    this.applied = false;
    this.sections = {};
    this._type = 'theme';
    this._labels = [ 'Theme', this.manifest?.name ];
  }

  registerSettings (render) {
    vizality.api.settings.registerSettings({
      type: toPlural(this._type),
      addonId: this.addonId,
      render
    });
  }

  log (...message) {
    // In case the addon wants to provide their own labels
    if (isArray(message[0])) {
      const _message = message.slice(1);
      log({ labels: message[0], message: _message });
    } else {
      log({ labels: this._labels, message });
    }
  }

  warn (...message) {
    // In case the addon wants to provide their own labels
    if (isArray(message[0])) {
      const _message = message.slice(1);
      warn({ labels: message[0], message: _message });
    } else {
      warn({ labels: this._labels, message });
    }
  }

  error (...message) {
    // In case the addon wants to provide their own labels
    if (isArray(message[0])) {
      const _message = message.slice(1);
      error({ labels: message[0], message: _message });
    } else {
      error({ labels: this._labels, message });
    }
  }

  /**
   * 
   * @returns 
   * @private
   */
  _load () {
    if (!this.applied) {
      this.applied = true;
      const style = createElement('style', {
        id: `theme-${this.addonId}`,
        'vz-style': true,
        'vz-theme': true
      });
      document.head.appendChild(style);
      this._doCompile = debounce(async (showLogs = true) => {
        style.innerHTML = await this.compiler.compile();
        if (showLogs) this.log('Theme compiled successfully.');
      }, 300);
      this.compiler.enableWatcher();
      this.compiler.on('src-update', this._doCompile);
      this.log('Theme loaded.');
      if (Array.isArray(this.manifest.settings)) {
        const settings = this._mapSettings(this.manifest.settings);
        this.registerSettings(() => jsonToReact(settings, (id, value) => {
          this.settings.set(id, value);
          this._injectSettings();
        }));
        this._injectSettings();
      }
      return this._doCompile(false);
    }
  }

  /**
   * 
   * @param {*} settings 
   * @returns 
   * @private
   */
  _mapSettings (settings) {
    return settings.map(setting => {
      if (setting.type === 'category') {
        return {
          ...setting,
          items: this._mapSettings(setting.items)
        };
      }
      if (setting.type === 'divider' ||
          setting.type === 'markdown') {
        return setting;
      }
      return {
        ...setting,
        get value () { return this.settings.get(setting.id, setting.defaultValue); },
        settings: this.settings
      };
    });
  }

  /**
   * 
   * @param {*} _settings 
   * @returns 
   * @private
   */
  _getSettings (_settings) {
    const settings = [];
    for (const setting of _settings) {
      if (setting.type === 'category') {
        settings.push(...this._getSettings(setting.items));
        continue;
      }
      if (setting.type === 'divider' || setting.type === 'markdown') {
        continue;
      }
      settings.push({
        type: setting.type,
        id: toKebabCase(setting.id),
        value: this.settings.get(setting.id, setting.defaultValue)
      });
    }
    return settings;
  }

  /**
   * 
   * @private
   */
  _injectSettings () {
    if (!this.settingsStyle) {
      this.settingsStyle = document.head.appendChild(createElement('style', {
        id: `theme_settings-${this.addonId}`,
        'vz-theme': true,
        'vz-style': true
      }));
    }
    let settingsString = '\n:root {';
    const settingsItems = this._getSettings(this.manifest.settings);
    for (const setting of settingsItems) {
      settingsString += `\n\t--${setting.id}: ${typeof setting.value === 'string' && setting.type !== 'color'
        ? `"${setting.value}"`
        : typeof setting.value === 'number'
          ? `${setting.value}px`
          : setting.value
      } !important;`;
    }
    this.settingsStyle.innerHTML = settingsString += '\n}\n';
  }

  /**
   * 
   * @private
   */
  _destroySettings () {
    if (this.settingsStyle) {
      this.settingsStyle.remove();
    }
    if (this.sections.settings) {
      vizality.api.settings.unregisterSettings(this.addonId);
    }
  }

  /**
   * Unloads a theme.
   * @private
   */
  _unload () {
    try {
      if (this.applied) {
        this.applied = false;
        this.compiler.off('src-update', this._doCompile);
        if (document.getElementById(`theme-${this.addonId}`)) {
          document.getElementById(`theme-${this.addonId}`).remove();
        }
        this.compiler.disableWatcher();
        this._destroySettings();
        this.log('Theme unloaded.');
      }
    } catch (err) {

    }
  }
}
