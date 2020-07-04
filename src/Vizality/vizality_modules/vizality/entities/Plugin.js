const { existsSync } = require('fs');
const { join } = require('path');
const { sleep, createElement, logger } = require('vizality/util');
const { resolveCompiler } = require('vizality/compilers');
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
  }

  // Getters
  get isInternal () {
    return this.entityID.startsWith('vz-');
  }

  get colorContrast () {
    if (this.manifest.color) {
      const r = `0x${this.manifest.color[1]}${this.manifest.color[2]}`;
      const g = `0x${this.manifest.color[3]}${this.manifest.color[4]}`;
      const b = `0x${this.manifest.color[5]}${this.manifest.color[6]}`;

      if ((r * 0.299) + (g * 0.587) + (b * 0.114) > 186) {
        return '#000';
      }

      return '#fff';
    }

    return '#fff';
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

  get color () {
    return '#7289da';
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
        throw new Error(`Cannot find "${path}"! Make sure the file exists and try again.`);
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
        await this.startPlugin();
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
    logger.log('Plugin', this.constructor.name, this.manifest.color || null, ...data);
  }

  error (...data) {
    logger.error('Plugin', this.constructor.name, this.manifest.color || null, ...data);
  }

  warn (...data) {
    logger.warn('Plugin', this.constructor.name, this.manifest.color || null, ...data);
  }
}

module.exports = Plugin;
