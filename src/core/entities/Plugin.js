import { join, win32, extname } from 'path';
import { existsSync } from 'fs';
import watch from 'node-watch';

import { error, log, warn } from '@vizality/util/logger';
import { resolveCompiler } from '@vizality/compilers';
import { createElement } from '@vizality/util/dom';
import { Directories } from '@vizality/constants';
import { sleep } from '@vizality/util/time';

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
    this._submoduleColor = this.manifest.color || null;
  }

  get dependencies () {
    return this.manifest.dependencies;
  }

  get optionalDependencies () {
    return this.manifest.optionalDependencies;
  }

  get effectiveOptionalDependencies () {
    const deps = this.manifest.optionalDependencies;
    const disabled = vizality.settings.get('disabledPlugins', []);
    return deps.filter(d => vizality.manager.plugins.get(d) !== void 0 && !disabled.includes(d));
  }

  get allDependencies () {
    return this.dependencies.concat(this.optionalDependencies);
  }

  get allEffectiveDependencies () {
    return this.dependencies.concat(this.effectiveOptionalDependencies);
  }

  get dependents () {
    const dependents = [ ...vizality.manager.plugins.values ].filter(p => p.manifest.dependencies.includes(this.addonId));
    return [ ...new Set(dependents.map(d => d.addonId).concat(...dependents.map(d => d.dependents))) ];
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
      resolvedPath = join(Directories.PLUGINS, this.addonId, path);

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

  // Update
  async _update (force = false) {
    const success = await super._update(force);
    if (success && this._ready) {
      await vizality.manager.plugins.remount(this.addonId);
    }
    return success;
  }

  /**
   * Enables the file watcher. Will emit "src-update" event if any of the files are updated.
   */
  async _enableWatcher () {
    this._watcherEnabled = vizality.settings.get('hotReload', false);
  }

  /**
   * Disables the file watcher. MUST be called if you no longer need the compiler and the watcher
   * was previously enabled.
   */
  async _disableWatcher () {
    this._watcherEnabled = false;
    this._watchers.close();
    this._watchers = {};
  }

  /** @private */
  async _watchFiles () {
    const _this = this;
    this._watchers = watch(this.addonPath, {
      recursive: true,
      async filter (f, skip) {
        // skip node_modules
        if ((/\\node_modules/).test(f)) return skip;
        // skip .git folder
        if ((/\.git/).test(f)) return skip;
        // Don't do anything if it's a Sass/CSS file or the manifest file
        if (win32.basename(f) === 'manifest.json' || extname(f) === '.scss' || extname(f) === '.css') return skip;
        await vizality.manager.plugins.remount(_this.addonId);
      }
    });
  }

  // Internals
  async load () {
    try {
      while (!this.allEffectiveDependencies.every(pluginName => vizality.manager.plugins.get(pluginName)._ready)) {
        await sleep(1);
      }

      if (typeof this.onStart === 'function') {
        const before = performance.now();

        await this.onStart();

        const after = performance.now();

        const time = parseFloat((after - before).toFixed()).toString().replace(/^0+/, '') || 0;

        this.log(`Plugin loaded. Initialization took ${time} ms.`);
      }
    } catch (err) {
      this.error('An error occurred during initialization!', err);
    } finally {
      this._ready = true;
      /*
       * @todo Have this be a toggleable developer setting, default to off. Also have a notice
       * warning about potential performance issues, though I haven't encountered any yet, the
       * potential still exists from the extra overhead. Also seems to have a bug/interference
       * with JSX file caching, which you can see if you disable a plugin, edit a file, and enable
       * the plugin.
       */
      this._enableWatcher();
      if (this._watcherEnabled) {
        this._watchFiles();
      }
    }
  }

  async unload () {
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
      if (this._watchers && this._watchers.isClosed && !this._watchers.isClosed()) {
        await this._disableWatcher();
      }
    }
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
}
