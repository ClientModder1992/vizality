const { dom: { createElement }, logger: { error, log, warn }, sleep } = require('@util');
const { resolveCompiler } = require('@compilers');

const { existsSync } = require('fs');
const { join } = require('path');

const Updatable = require('./Updatable');

/**
 * Main class for Vizality plugins
 * @property {Boolean} ready Whether the plugin is ready or not
 * @property {SettingsCategory} settings Plugin settings
 * @property {Object.<String, Compiler>} styles Styles the plugin loaded
 * @abstract
 */
class Plugin extends Updatable {
  constructor () {
    super(vizality.pluginManager.pluginDir);
    this.settings = vizality.api.settings.buildCategoryObject(this.entityID);
    this.ready = false;
    this.styles = {};

    this.module = 'Plugin';
    this.submodule = this.constructor.name;
    this.submoduleColor = this.manifest.color || null;
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
    return deps.filter(d => vizality.pluginManager.get(d) !== void 0 && !disabled.includes(d));
  }

  get allDependencies () {
    return this.dependencies.concat(this.optionalDependencies);
  }

  get allEffectiveDependencies () {
    return this.dependencies.concat(this.effectiveOptionalDependencies);
  }

  get dependents () {
    const dependents = [ ...vizality.pluginManager.plugins.values() ].filter(p => p.manifest.dependencies.includes(this.entityID));
    return [ ...new Set(dependents.map(d => d.entityID).concat(...dependents.map(d => d.dependents))) ];
  }

  /**
   * Loads a plugin stylesheet. Will automatically get removed at plugin unload.
   * @param {String} path Stylesheet path. Either absolute or relative to the plugin root
   */
  loadStylesheet (path) {
    let resolvedPath = path;
    if (!existsSync(resolvedPath)) {
      // Assume it's a relative path and try resolving it
      resolvedPath = join(vizality.pluginManager.pluginDir, this.entityID, path);

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
    this.styles[id] = compiler;
    const compile = async () => {
      style.innerHTML = await compiler.compile();
    };

    compiler.enableWatcher();
    compiler.on('src-update', compile);
    this[`__compileStylesheet_${id}`] = compile;
    this[`__compiler_${id}`] = compiler;
    return compile();
  }

  // Update
  async _update (force = false) {
    const success = await super._update(force);
    if (success && this.ready) {
      await vizality.pluginManager.remount(this.entityID);
    }
    return success;
  }

  // Internals
  async _load () {
    try {
      while (!this.allEffectiveDependencies.every(pluginName => vizality.pluginManager.get(pluginName).ready)) {
        await sleep(1);
      }

      if (typeof this.startPlugin === 'function') {
        /**
         * @todo: Possibly add the next commented items as some sort of 'Debug Mode' settings option
         */
        // const before = performance.now();

        await this.startPlugin();

        // const after = performance.now();

        // const time = parseFloat((after - before).toFixed(4)).toString().replace(/^0+/, '');

        // this.log(`Plug initialization took ${time} ms.`);
      }

      this.log('Plugin loaded.');
    } catch (e) {
      this.error('An error occurred during initialization!', e);
    } finally {
      this.ready = true;
    }
  }

  async _unload () {
    try {
      for (const id in this.styles) {
        this[`__compiler_${id}`].on('src-update', this[`__compileStylesheet_${id}`]);
        document.getElementById(`style-${this.entityID}-${id}`).remove();
        this.styles[id].disableWatcher();
      }

      if (typeof this.pluginWillUnload === 'function') {
        await this.pluginWillUnload();
      }

      this.log('Plugin unloaded');
    } catch (e) {
      this.error('An error occurred during shutting down! It\'s heavily recommended reloading Discord to ensure there are no conflicts.', e);
    } finally {
      this.ready = false;
    }
  }

  log (...data) {
    log(this.module, this.submodule, this.submoduleColor, ...data);
  }

  error (...data) {
    error(this.module, this.submodule, this.submoduleColor, ...data);
  }

  warn (...data) {
    warn(this.module, this.submodule, this.submoduleColor, ...data);
  }
}

module.exports = Plugin;
