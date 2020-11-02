const { sleep, dom: { createElement }, logger: { error, log, warn } } = require('@util');
const { resolveCompiler } = require('@compilers');
const { Directories } = require('@constants');
const watch = require('node-watch');

const { existsSync, readdirSync } = require('fs');
const { join, win32, extname } = require('path');

const Updatable = require('./Updatable');

/**
 * Main class for Vizality builtins
 * @property {boolean} _ready Whether the builtin is ready or not
 * @property {SettingsCategory} settings Builtin settings
 * @property {object<string, Compiler>} styles Styles the builtin loaded
 * @abstract
 */
module.exports = class Builtin extends Updatable {
  constructor () {
    super(vizality.manager.builtins._dir);
    this.settings = vizality.api.settings.buildCategoryObject(this.entityID);
    this.styles = {};
    this._ready = false;
    this._watcherEnabled = true;
    this._watchers = {};
    this._module = 'Builtin';
    this._submodule = this.constructor.name;
    this._submoduleColor = this.manifest.color || null;
  }

  // Getters
  get isInternal () {
    return this.entityID.startsWith('vz-');
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
    return deps.filter(d => vizality.manager.builtins.get(d) !== void 0 && !disabled.includes(d));
  }

  get allDependencies () {
    return this.dependencies.concat(this.optionalDependencies);
  }

  get allEffectiveDependencies () {
    return this.dependencies.concat(this.effectiveOptionalDependencies);
  }

  get dependents () {
    const dependents = [ ...vizality.manager.builtins.values ].filter(p => p.manifest.dependencies.includes(this.entityID));
    return [ ...new Set(dependents.map(d => d.entityID).concat(...dependents.map(d => d.dependents))) ];
  }

  /**
   * Injects a style element containing the styles from the specified stylesheet into the
   * document head. Style element (and styles) are automatically removed on
   * plugin disable/unload.
   * @param {string} path Stylesheet path. Either absolute or relative to the plugin root
   * @returns {void}
   */
  injectStyles (path) {
    let resolvedPath = path;
    if (!existsSync(resolvedPath)) {
      // Assume it's a relative path and try resolving it
      resolvedPath = join(Directories.BUILTINS, this.entityID, path);

      if (!existsSync(resolvedPath)) {
        throw new Error(`Cannot find '${path}'! Make sure the file exists and try again.`);
      }
    }

    const id = Math.random().toString(36).slice(2);
    const compiler = resolveCompiler(resolvedPath);
    const style = createElement('style', {
      id: `style-${this.entityID}-${id}`,
      'vz-style': true,
      'vz-plugin': true
    });

    document.head.appendChild(style);
    const compile = async () => (style.innerHTML = await compiler.compile());
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
      await vizality.manager.builtins.remount(this.entityID);
    }
    return success;
  }

  /**
   * Enables the file watcher. Will emit "src-update" event if any of the files are updated.
   */
  enableWatcher () {
    this._watcherEnabled = true;
  }

  /**
   * Disables the file watcher. MUST be called if you no longer need the compiler and the watcher
   * was previously enabled.
   */
  disableWatcher () {
    this._watcherEnabled = false;
    this._watchers.close();
    this._watchers = {};
  }

  /** @private */
  async _watchFiles () {
    const _this = this;
    this._watchers = watch(this.entityPath, {
      recursive: true,
      filter (f, skip) {
        // skip node_modules
        if ((/\/node_modules/).test(f)) return skip;
        // skip .git folder
        if ((/\.git/).test(f)) return skip;
        // Don't do anything if it's a Sass/CSS file or the manifest file
        if (win32.basename(f) === 'manifest.json' || extname(f) === '.scss' || extname(f) === '.css') return;
        vizality.manager.plugins.remount(_this.entityID);
      }
    });
  }

  // Internals
  async _load () {
    try {
      while (!this.allEffectiveDependencies.every(pluginName => vizality.manager.builtins.get(pluginName)._ready)) {
        await sleep(1);
      }

      if (typeof this.onStart === 'function') {
        const before = performance.now();

        await this.onStart();

        const after = performance.now();

        const time = parseFloat((after - before).toFixed()).toString().replace(/^0+/, '');

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
      this.enableWatcher();
      if (this._watcherEnabled) {
        this._watchFiles();
      }
    }
  }

  async _unload () {
    try {
      for (const id in this.styles) {
        this.styles[id].compiler.on('src-update', this.styles[id].compile);
        this.styles[id].compiler.disableWatcher();
        document.getElementById(`style-${this.entityID}-${id}`).remove();
      }

      this.styles = {};
      if (typeof this.onStop === 'function') {
        await this.onStop();
      }
      this.log('Plugin unloaded');
    } catch (e) {
      this.error('An error occurred during shutting down! It\'s heavily recommended reloading Discord to ensure there are no conflicts.', e);
    } finally {
      this._ready = false;
      // this._watcher.close();
      if (this._watcherEnabled) {
        this.disableWatcher();
      }
    }
  }

  log (...data) {
    log(this._module, this._submodule, this._submoduleColor, ...data);
  }

  error (...data) {
    error(this._module, this._submodule, this._submoduleColor, ...data);
  }

  warn (...data) {
    warn(this._module, this._submodule, this._submoduleColor, ...data);
  }
};
