import { log, warn, error } from '@vizality/util/logger';
import { resolveCompiler } from '@vizality/compilers';
import { createElement } from '@vizality/util/dom';
import { Directories } from '@vizality/constants';
import { jsonToReact } from '@vizality/util/react';
import { toPlural, toKebabCase } from '@vizality/util/string';
import { debounce } from 'lodash';

import Updatable from './Updatable';

export default class Theme extends Updatable {
  constructor (addonId, manifest) {
    super(Directories.THEMES, addonId);
    this.settings = vizality.api.settings.buildCategoryObject(this.addonId);
    this.compiler = resolveCompiler(manifest.effectiveTheme);
    this.manifest = manifest;
    this.applied = false;
    this.sections = {};

    this._type = 'theme';
    this._labels = [ this._type, this.manifest?.name ];
  }

  registerSettings (render) {
    vizality.api.settings.registerSettings({
      type: toPlural(this._type),
      addonId: this.addonId,
      render
    });
  }

  log (...message) { log({ labels: this._labels, message }); }
  warn (...message) { warn({ labels: this._labels, message }); }
  error (...message) { error({ labels: this._labels, message }); }

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

  _mapSettings (settings) {
    return settings.map(setting => {
      if (setting.type === 'category') {
        return {
          ...setting,
          items: this._mapSettings(setting.items)
        };
      }
      if (setting.type === 'divider') return setting;
      if (setting.type === 'markdown') return setting;

      return {
        ...setting,
        get value () { return this.settings.get(setting.id, setting.defaultValue); },
        settings: this.settings
      };
    });
  }

  _getSettings (_settings) {
    const settings = [];

    for (const setting of _settings) {
      if (setting.type === 'category') {
        settings.push(...this._getSettings(setting.items));
        continue;
      }
      if (setting.type === 'divider') continue;
      if (setting.type === 'markdown') continue;
      settings.push({
        type: setting.type,
        id: toKebabCase(setting.id),
        value: this.settings.get(setting.id, setting.defaultValue)
      });
    }

    return settings;
  }

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

  _destroySettings () {
    if (this.settingsStyle) this.settingsStyle.remove();
    if (this.sections.settings) vizality.api.settings.unregisterSettings(this.addonId);
  }

  _unload () {
    if (this.applied) {
      this.applied = false;
      this.compiler.off('src-update', this._doCompile);
      document.getElementById(`theme-${this.addonId}`).remove();
      this.compiler.disableWatcher();
      this._destroySettings();
      this.log('Theme unloaded.');
    }
  }
}
