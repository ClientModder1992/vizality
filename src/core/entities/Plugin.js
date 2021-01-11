import { join, sep } from 'path';
import { watch } from 'chokidar';
import { existsSync } from 'fs';

import { error, log, warn } from '@vizality/util/logger';
import { resolveCompiler } from '@vizality/compilers';
import { createElement } from '@vizality/util/dom';
import { Directories } from '@vizality/constants';
import { toPlural } from '@vizality/util/string';

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
    super(vizality.manager.plugins.dir);
    this.settings = vizality.api.settings.buildCategoryObject(this.addonId);
    this.styles = {};
    this._ready = false;
    this._watcherEnabled = true;
    this._watchers = {};
    this._module = 'Plugin';
    this._submodule = this.constructor.name;
  }

  /**
   * Injects a style element containing the styles from the specified stylesheet into the
   * document head. Style element (and styles) are automatically removed on
   * plugin disable/unload.
   * @param {string} path Stylesheet path. Either absolute or relative to the plugin root
   * @param {boolean} suppress Whether or not to suppress errors in console
   * @returns {void}
   */
  injectStyles (path, suppress = false) {
    let resolvedPath = path;
    if (!existsSync(resolvedPath)) {
      // Assume it's a relative path and try resolving it
      resolvedPath = join(this._module === 'Plugin' ? Directories.PLUGINS : Directories.BUILTINS, this.addonId, path);

      if (!existsSync(resolvedPath)) {
        throw new Error(`Cannot find '${path}'! Make sure the file exists and try again.`);
      }
    }

    const id = Math.random().toString(36).slice(2);
    const compiler = resolveCompiler(resolvedPath);
    const style = createElement('style', {
      id: `plugin-${this.addonId}-${id}`,
      'vz-style': '',
      'vz-plugin': ''
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
   * Update
   * @private
   */
  async _update (force = false) {
    const success = await super._update(force);
    if (success && this._ready) {
      await vizality.manager[toPlural(this._module).toLowerCase()].remount(this.addonId);
    }
    return success;
  }

  /**
   * Enables the file watcher. Will emit "src-update" event if any of the files are updated.
   * @private
   */
  async _enableWatcher () {
    this._watcherEnabled = vizality.settings.get('hotReload', false);
  }

  /**
   * Disables the file watcher. MUST be called if you no longer need the compiler and the watcher
   * was previously enabled.
   * @private
   */
  async _disableWatcher () {
    this._watcherEnabled = false;
    this._watchers.close();
  }

  /** @private */
  async _watchFiles () {
    const _module = 'Watcher';

    this._watchers = watch(this.addonPath, {
      ignored: [ /node_modules/, /.git/, /manifest.json/, '*.scss', '*.css' ],
      ignoreInitial: true
    });

    this._watchers
      .on('all', async () => vizality.manager[toPlural(this._module).toLowerCase()].remount(this.addonId));

    this._watchers
      .on('add', path => log(_module, `${this._module}:${this._submodule}`, null, `File "${path.replace(this.addonPath + sep, '')}" has been added.`))
      .on('change', path => log(_module, `${this._module}:${this._submodule}`, null, `File "${path.replace(this.addonPath + sep, '')}" has been changed.`))
      .on('unlink', path => log(_module, `${this._module}:${this._submodule}`, null, `File "${path.replace(this.addonPath + sep, '')}" has been removed.`));

    // More possible events.
    this._watchers
      .on('addDir', path => log(_module, `${this._module}:${this._submodule}`, null, `Directory "${path.replace(this.addonPath + sep, '')}" has been added.`))
      .on('unlinkDir', path => log(_module, `${this._module}:${this._submodule}`, null, `Directory "${path.replace(this.addonPath + sep, '')}" has been removed.`))
      .on('error', error => log(_module, `${this._module}:${this._submodule}`, null, `Watcher error: ${error.replace(this.addonPath + sep, '')}`));
  }

  /**
   * @private
   */
  async _load () {
    try {
      if (typeof this.onStart === 'function') {
        const before = performance.now();

        await this.onStart();

        const after = performance.now();

        const time = parseFloat((after - before).toFixed()).toString().replace(/^0+/, '') || 0;

        this.log(`Plugin loaded. Initialization took ${time} ms.`);
      }
    } catch (err) {
      this.error('An error occurred during initialization!', err);
    }

    this._ready = true;
    /*
     * @todo Seems to possibly have a bug/interference with file caching, which you can see
     * if you disable a plugin, edit a file, and enable the plugin.
     */
    this._enableWatcher();
    if (this._watcherEnabled) {
      await this._watchFiles();
    }
  }

  /**
   * @private
   */
  async _unload () {
    try {
      for (const id in this.styles) {
        this.styles[id].compiler.on('src-update', this.styles[id].compile);
        this.styles[id].compiler.disableWatcher();
        document.getElementById(`plugin-${this.addonId}-${id}`).remove();
      }

      this.styles = {};
      if (typeof this.onStop === 'function') {
        await this.onStop();
      }
      this.log('Plugin unloaded.');
    } catch (e) {
      this.error(`An error occurred during shutting down! It's heavily recommended reloading Discord to ensure there are no conflicts.`, e);
    } finally {
      this._ready = false;
      if (this._watchers) {
        await this._disableWatcher();
      }
    }
  }
}
