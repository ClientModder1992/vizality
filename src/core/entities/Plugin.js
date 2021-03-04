import { toPlural, toTitleCase } from '@vizality/util/string';
import { log, warn, error } from '@vizality/util/logger';
import { resolveCompiler } from '@vizality/compilers';
import { unpatchAllByAddon } from '@vizality/patcher';
import { jsonToReact } from '@vizality/util/react';
import { createElement } from '@vizality/util/dom';
import { Directories } from '@vizality/constants';
import { isArray } from '@vizality/util/array';
import { debounce } from 'lodash';
import { join, sep } from 'path';
import { watch } from 'chokidar';
import { existsSync } from 'fs';

import Updatable from './Updatable';

/*
 * @property {boolean} _ready Whether the plugin is ready or not
 * @property {SettingsCategory} settings Plugin settings
 * @property {object<string, Compiler>} styles Styles the plugin loaded
 */

/**
 * @todo Finish writing this.
 * Main class for Vizality plugins.
 * @typedef VizalityPlugin
 * @extends Updatable
 * @extends Events
 */
export default class Plugin extends Updatable {
  constructor () {
    super(Directories.PLUGINS);
    this.settings = vizality.api.settings.buildCategoryObject(this.addonId);
    this.styles = {};
    this.sections = {};
    this._ready = false;
    this._watcherEnabled = null;
    this._watcher = {};
    this._type = 'plugin';
    this._labels = [ 'Plugin', this.manifest?.name || this.constructor?.name ];
  }

  /**
   * Injects a style element containing the styles from the specified stylesheet into the
   * document head. Style element (and styles) are automatically removed on
   * plugin disable/unload.
   * @param {string} path Stylesheet path. Either absolute or relative to the plugin root
   * @param {boolean} suppress Whether or not to suppress errors in console
   */
  injectStyles (path, suppress = false) {
    let compiler, style, compiled, id;
    try {
      let resolvedPath = path;
      if (!existsSync(resolvedPath)) {
        // Assume it's a relative path and try resolving it
        resolvedPath = join(this.path, path);
        if (!existsSync(resolvedPath)) {
          throw new Error(`Cannot find "${path}"! Make sure the file exists and try again.`);
        }
      }

      id = Math.random().toString(36).slice(2);
      compiler = resolveCompiler(resolvedPath);
      style = createElement('style', {
        id: `${this._type}-${this.addonId}-${id}`,
        'vz-style': '',
        [`vz-${this._type}`]: ''
      });

      document.head.appendChild(style);
    } catch (err) {
      return this.error(err);
    }

    const compile = async () => {
      try {
        compiled = await compiler.compile();
      } catch (err) {
        if (!suppress) {
          this.error(err);
        }
      } finally {
        style.innerHTML = compiled || '';
      }
    };

    try {
      this.styles[id] = {
        compiler,
        compile
      };

      compiler.enableWatcher();
      compiler.on('src-update', compile);
      return compile();
    } catch (err) {
      return this.error(err);
    }
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
   * Update the addon.
   * @private
   */
  async _update (force = false) {
    const success = await super._update(force);
    if (success && this._ready) {
      this.log(`${toTitleCase(this._type)} has been successfully updated.`);
      await vizality.manager[toPlural(this._type)].remount(this.addonId, false);
    }
    return success;
  }

  /**
   * Enables the file watcher.
   * @private
   */
  async _enableWatcher () {
    /**
     * @note Don't enable the watcher for builtins unless the user is a Vizality developer.
     * No need to use extra resources watching something that shouldn't need it.
     */
    if (!this.manifest) {
      if (!vizality.settings.get('verifiedVizalityDeveloper', false)) {
        this._watcherEnabled = false;
      } else {
        this._watcherEnabled = vizality.settings.get('hotReload', false);
      }
    } else {
      if (typeof this.manifest.hotReload?.enable === 'boolean') {
        this._watcherEnabled = this.manifest.hotReload.enable;
      } else {
        this._watcherEnabled = vizality.settings.get('hotReload', false);
      }
    }
  }

  /**
   * Disables the file watcher. MUST be called if you no longer need the compiler and the watcher
   * was previously enabled.
   * @private
   */
  async _disableWatcher () {
    this._watcherEnabled = false;
    if (this._watcher?.close) {
      await this._watcher.close();
      this._watcher = {};
    }
  }

  /**
   * @private
   */
  async _watchFiles () {
    const ignored = [];
    if (this.manifest?.hotReload?.ignore) {
      if (isArray(this.manifest.hotReload.ignore)) {
        for (const ign of this.manifest.hotReload.ignore) {
          if (ign.startsWith('*')) {
            ignored.push(ign);
          } else {
            ignored.push(new RegExp(ign));
          }
        }
      } else {
        if (this.manifest.hotReload.ignore.startsWith('*')) {
          ignored.push(this.manifest.hotReload.ignore);
        } else {
          ignored.push(new RegExp(this.manifest.hotReload.ignore));
        }
      }
    }

    this._watcher = watch(this.path, {
      ignored: [ /node_modules/, /.git/, /manifest.json/, /.scss/, /.css/ ].concat(ignored),
      ignoreInitial: true
    });

    this._watcher
      .on('add', path =>
        log({
          labels: [ 'Watcher', ...this._labels ],
          message: `File "${path.replace(this.path + sep, '')}" has been added.`
        }))
      .on('change', path =>
        log({
          labels: [ 'Watcher', ...this._labels ],
          message: `File "${path.replace(this.path + sep, '')}" has been changed.`
        }))
      .on('unlink', path =>
        log({
          labels: [ 'Watcher', ...this._labels ],
          message: `File "${path.replace(this.path + sep, '')}" has been removed.`
        }))
      .on('addDir', path =>
        log({
          labels: [ 'Watcher', ...this._labels ],
          message: `Directory "${path.replace(this.path + sep, '')}" has been added.`
        }))
      .on('unlinkDir', path =>
        log({
          labels: [ 'Watcher', ...this._labels ],
          message: `Directory "${path.replace(this.path + sep, '')}" has been removed.`
        }))
      .on('error', error =>
        error({
          labels: [ 'Watcher', ...this._labels ],
          message: error
        }))
      .on('all', debounce(async () => vizality.manager[toPlural(this._type).toLowerCase()].remount(this.addonId), 300));
  }

  /**
   * @private
   */
  async _load (showLogs = true) {
    try {
      if (typeof this.start === 'function') {
        const before = performance.now();
        await this.start();
        const after = performance.now();
        const time = parseFloat((after - before).toFixed()).toString().replace(/^0+/, '') || 0;

        if (!this.sections.settings && this._type !== 'builtin') {
          let Render;
          if (this.manifest?.sections?.settings) {
            Render = await import(join(this.path, this.manifest.sections.settings));
          } else if (existsSync(join(this.path, 'Settings.jsx'))) {
            Render = await import(join(this.path, 'Settings.jsx'));
          } else if (existsSync(join(this.path, 'components', 'Settings.jsx'))) {
            Render = await import(join(this.path, 'components', 'Settings.jsx'));
          }

          if (Render) {
            vizality.api.settings.registerSettings({
              type: toPlural(this._type),
              addonId: this.addonId,
              render: Render
            });
          }
        }

        if (showLogs) {
          this.log(`${toTitleCase(this._type)} loaded. Initialization took ${time} ms.`);
        }
      } else {
        this.warn(`${toTitleCase(this._type)} has no "start" method!`);
      }
    } catch (err) {
      this.error('An error occurred during initialization!', err);
    }

    this._ready = true;

    await this._enableWatcher();

    if (this._watcherEnabled) {
      await this._watchFiles();
    }

    if (Array.isArray(this.manifest?.settings)) {
      const settings = this._mapSettings(this.manifest.settings);
      this.registerSettings(() => jsonToReact(settings, (id, value) => {
        this.settings.set(id, value);
      }));
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

  /**
   * @private
   */
  async _unload (showLogs = true) {
    try {
      for (const id in this.styles) {
        this.styles[id].compiler.on('src-update', this.styles[id].compile);
        this.styles[id].compiler.disableWatcher();
        if (document.getElementById(`${this._type}-${this.addonId}-${id}`)) {
          document.getElementById(`${this._type}-${this.addonId}-${id}`).remove();
        }
      }

      this.styles = {};
      if (typeof this.stop === 'function') {
        await this.stop();
      }

      if (this._type !== 'builtin') {
        // Unregister settings
        if (this.sections.settings) {
          vizality.api.settings.unregisterSettings(this.addonId);
        }

        unpatchAllByAddon(this.addonId);
      }

      if (showLogs) {
        this.log(`${toTitleCase(this._type)} unloaded.`);
      }
    } catch (err) {
      this.error(`An error occurred during shutting down! It's heavily recommended reloading Discord to ensure there are no conflicts.`, err);
    } finally {
      this._ready = false;
      if (this._watcher) {
        await this._disableWatcher();
      }
    }
  }
}
