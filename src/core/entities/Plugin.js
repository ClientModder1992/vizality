import { join, sep } from 'path';
import { watch } from 'chokidar';
import { existsSync } from 'fs';

import { toPlural, toSingular } from '@vizality/util/string';
import { error, log, warn } from '@vizality/util/logger';
import { resolveCompiler } from '@vizality/compilers';
import { createElement } from '@vizality/util/dom';
import { Directories } from '@vizality/constants';
import { isArray } from '@vizality/util/array';

import Updatable from './Updatable';

/**
 * Main class for Vizality plugins
 * @property {boolean} _ready Whether the plugin is ready or not
 * @property {SettingsCategory} settings Plugin settings
 * @property {object<string, Compiler>} styles Styles the plugin loaded
 * @abstract
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
    this._module = 'Plugin';
    this._submodule = this.constructor.name;
  }

  /**
   * Injects a style element containing the styles from the specified stylesheet into the
   * document head. Style element (and styles) are automatically removed on
   * plugin disable/unload.
   * @param {string} path Stylesheet path. Either absolute or relative to the plugin root
   * @param {boolean} suppress Whether or not to suppress errors in console
   * @returns {undefined}
   */
  injectStyles (path, suppress = false) {
    let resolvedPath = path;
    if (!existsSync(resolvedPath)) {
      // Assume it's a relative path and try resolving it
      resolvedPath = join(this.path, path);

      if (!existsSync(resolvedPath)) {
        throw new Error(`Cannot find "${path}"! Make sure the file exists and try again.`);
      }
    }

    const id = Math.random().toString(36).slice(2);
    const compiler = resolveCompiler(resolvedPath);
    const mdl = toSingular(this._module).toLowerCase();
    const style = createElement('style', {
      id: `${mdl}-${this.addonId}-${id}`,
      'vz-style': '',
      [`vz-${mdl}`]: ''
    });

    document.head.appendChild(style);

    const compile = async () => {
      let compiled;
      if (suppress) {
        try {
          compiled = await compiler.compile();
        } catch (err) {
          // Fail silently
        } finally {
          style.innerHTML = compiled || '';
        }
      } else {
        compiled = await compiler.compile();
        style.innerHTML = compiled;
      }
    };

    this.styles[id] = {
      compiler,
      compile
    };

    compiler.enableWatcher();
    compiler.on('src-update', compile);
    return compile();
  }

  registerSettings (render) {
    vizality.api.settings._registerSettings({
      type: toPlural(this._module).toLowerCase(),
      addonId: this.addonId,
      render
    });
  }

  log (...data) {
    log(this._module, this._submodule, null, ...data);
  }

  error (...data) {
    error(this._module, this._submodule, null, ...data);
  }

  warn (...data) {
    warn(this._module, this._submodule, null, ...data);
  }

  /**
   * Update the addon.
   * @private
   */
  async _update (force = false) {
    const success = await super._update(force);
    if (success && this._ready) {
      this.log(`${toSingular(this.module)} has been successfully updated.`);
      await vizality.manager[toPlural(this._module).toLowerCase()].remount(this.addonId, false);
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
      if (!vizality.settings.get('vizalityDeveloper', false)) {
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
    const _module = 'Watcher';

    const ignored = [];
    if (this.manifest?.hotReload?.ignore) {
      if (isArray(this.manifest.hotReload?.ignore)) {
        for (const ign of this.manifest.hotReload?.ignore) {
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
      ignored: [ /node_modules/, /.git/, /manifest.json/, '*.scss', '*.css' ].concat(ignored),
      ignoreInitial: true
    });

    this._watcher
      .on('add', path => log(_module, `${this._module}:${this._submodule}`, null, `File "${path.replace(this.path + sep, '')}" has been added.`))
      .on('change', path => log(_module, `${this._module}:${this._submodule}`, null, `File "${path.replace(this.path + sep, '')}" has been changed.`))
      .on('unlink', path => log(_module, `${this._module}:${this._submodule}`, null, `File "${path.replace(this.path + sep, '')}" has been removed.`))
      .on('addDir', path => log(_module, `${this._module}:${this._submodule}`, null, `Directory "${path.replace(this.path + sep, '')}" has been added.`))
      .on('unlinkDir', path => log(_module, `${this._module}:${this._submodule}`, null, `Directory "${path.replace(this.path + sep, '')}" has been removed.`))
      .on('error', error => log(_module, `${this._module}:${this._submodule}`, null, error))
      .on('all', window._.debounce(async () => vizality.manager[toPlural(this._module).toLowerCase()].remount(this.addonId, false), 300));
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

        if (this._module !== 'Builtin' && !this.sections.settings) {
          let Render;
          if (this.manifest.sections?.settings) {
            Render = await import(join(this.path, this.manifest.sections.settings));
          } else if (existsSync(join(this.path, 'Settings.jsx'))) {
            Render = await import(join(this.path, 'Settings.jsx'));
          } else if (existsSync(join(this.path, 'components', 'Settings.jsx'))) {
            Render = await import(join(this.path, 'components', 'Settings.jsx'));
          }

          if (Render) {
            vizality.api.settings._registerSettings({
              type: toPlural(this._module).toLowerCase(),
              addonId: this.addonId,
              render: Render
            });
          }
        }

        if (showLogs) {
          this.log(`${this._module} loaded. Initialization took ${time} ms.`);
        }
      } else {
        this.warn(`${this._module} has no "start" method!`);
      }
    } catch (err) {
      this.error('An error occurred during initialization!', err);
    }

    this._ready = true;

    await this._enableWatcher();

    if (this._watcherEnabled) {
      await this._watchFiles();
    }
  }

  /**
   * @private
   */
  async _unload (showLogs = true) {
    try {
      for (const id in this.styles) {
        this.styles[id].compiler.on('src-update', this.styles[id].compile);
        this.styles[id].compiler.disableWatcher();
        document.getElementById(`${toSingular(this._module).toLowerCase()}-${this.addonId}-${id}`).remove();
      }

      this.styles = {};
      if (typeof this.stop === 'function') {
        await this.stop();
      }

      // Unregister settings
      if (this.sections.settings) {
        vizality.api.settings._unregisterSettings(this.addonId);
      }

      if (showLogs) {
        this.log(`${this._module} unloaded.`);
      }
    } catch (e) {
      this.error(`An error occurred during shutting down! It's heavily recommended reloading Discord to ensure there are no conflicts.`, e);
    } finally {
      this._ready = false;
      if (this._watcher) {
        await this._disableWatcher();
      }
    }
  }
}
