const { file: { rmdirRf }, string: { toSingular, toHeaderCase } } = require('@utilities');
const { ROOT_FOLDER } = require('@constants');

const { readdirSync } = require('fs');
const { resolve } = require('path');

class AddonManager {
  constructor (type, dir) {
    this._dir = dir;
    this._type = type;
    this._requiredManifestKeys = [ 'name', 'version', 'description', 'author', 'license' ];

    this[type] = new Map();
  }

  get (addonId) {
    return this[this._type].get(addonId);
  }

  has (addonId) {
    return this[this._type].has(addonId);
  }

  getAll () {
    return [ ...this[this._type].keys() ];
  }

  isInstalled (addonId) {
    return this[this._type].has(addonId);
  }

  isEnabled (addonId) {
    return !vizality.settings.get(`disabled${toHeaderCase(this._type)}`, []).includes(addonId);
  }

  isInternal (addonId) {
    return false;
  }

  getAllEnabled () {
    const enabled = [];

    for (const addon of [ ...this[this._type].values() ]) {
      if (this.isEnabled(addon)) {
        enabled.push(addon.entityID);
      }
    }

    return enabled;
  }

  getAllDisabled () {
    return vizality.settings.get(`disabled${toHeaderCase(this._type)}`, []);
  }

  // Mount/load/enable/install shit
  mount (pluginID) {
    let manifest;
    try {
      manifest = Object.assign({
        appMode: 'app',
        dependencies: [],
        optionalDependencies: []
      }, require(resolve(this._dir, pluginID, 'manifest.json')));
    } catch (e) {
      return this.error(`${toSingular(toHeaderCase(this._type))} ${pluginID} doesn't have a valid manifest - Skipping`);
    }

    if (!this._requiredManifestKeys.every(key => manifest.hasOwnProperty(key))) {
      return this.error(`${toSingular(toHeaderCase(this._type))} ${pluginID} doesn't have a valid manifest - Skipping`);
    }

    try {
      const PluginClass = require(resolve(this._dir, pluginID));
      Object.defineProperties(PluginClass.prototype, {
        entityID: {
          get: () => pluginID,
          set: () => {
            throw new Error(`${toHeaderCase(this._type)} cannot update their ID at runtime!`);
          }
        },
        manifest: {
          get: () => manifest,
          set: () => {
            throw new Error(`${toHeaderCase(this._type)} cannot update manifest at runtime!`);
          }
        }
      });

      this[this._type].set(pluginID, new PluginClass());
    } catch (e) {
      this.error(`An error occurred while initializing "${pluginID}"!`, e);
    }
  }

  async remount (pluginID) {
    try {
      await this.unmount(pluginID);
    } catch (e) {
      // chhhh
    }
    this.mount(pluginID);
    this[this._type].get(pluginID)._load();
  }

  async unmount (pluginID) {
    const plugin = this.get(pluginID);
    if (!plugin) {
      throw new Error(`Tried to unmount a non-installed ${toSingular(this._type)}: ${plugin}`);
    }
    if (plugin._ready) {
      await plugin._unload();
    }

    Object.keys(require.cache).forEach(key => {
      if (key.includes(pluginID)) {
        delete require.cache[key];
      }
    });
    this[this._type].delete(pluginID);
  }

  // Load
  load (pluginID) {
    const plugin = this.get(pluginID);
    if (!plugin) {
      throw new Error(`Tried to load a non-installed ${toSingular(this._type)}: (${plugin})`);
    }
    if (plugin._ready) {
      return this.error(`Tried to load an already-loaded ${toSingular(this._type)}: (${pluginID})`);
    }

    plugin._load();
  }

  unload (pluginID) {
    const plugin = this.get(pluginID);
    if (!plugin) {
      throw new Error(`Tried to unload a non-installed ${toSingular(this._type)}: (${plugin})`);
    }
    if (!plugin._ready) {
      return this.error(`Tried to unload a non-loaded ${toSingular(this._type)}: (${plugin})`);
    }

    plugin._unload();
  }

  // Enable
  enable (pluginID) {
    if (!this.get(pluginID)) {
      throw new Error(`Tried to enable a non-installed ${toSingular(this._type)}: (${pluginID})`);
    }

    vizality.settings.set(
      'disabledPlugins',
      vizality.settings.get('disabledPlugins', []).filter(p => p !== pluginID)
    );

    this.load(pluginID);
  }

  disable (addonId) {
    const addon = this.get(addonId);

    if (!addon) {
      throw new Error(`Tried to disable a non-installed ${toSingular(this._type)}: (${addonId})`);
    }

    vizality.settings.set('disabledPlugins', [
      ...vizality.settings.get('disabledPlugins', []),
      addonId
    ]);

    this.unload(addonId);
  }

  async install (addonId) {
    throw new Error('no');
  }

  async uninstall (addonId) {
    if (this.isInternal(addonId)) {
      throw new Error(`You cannot uninstall an internal ${toSingular(this._type)}. (Tried to uninstall: ${addonId})`);
    }

    await this.unmount(addonId);
    await rmdirRf(resolve(this._dir, addonId));
  }

  // Start
  start (sync = false) {
    const missing = {};
    missing[this._type] = [];
    
    const isOverlay = (/overlay/).test(location.pathname);
    readdirSync(this._dir).sort(this._sortPlugins).forEach(filename =>/*!this.isInstalled(filename) &&*/ this.mount(filename));
    for (const plugin of [ ...this[this._type].values() ]) {
      if (vizality.settings.get('disabledPlugins', []).includes(plugin.entityID)) {
        continue;
      }
      if (
        (plugin.manifest.appMode === 'overlay' && isOverlay) ||
        (plugin.manifest.appMode === 'app' && !isOverlay) ||
        plugin.manifest.appMode === 'both'
      ) {
        if (sync && !this.get(plugin.entityID)._ready) {
          this.load(plugin.entityID);
          missing[this._type].push(plugin.entityID);
        } else if (!sync) {
          this.load(plugin.entityID);
        }
      } else {
        this[this._type].delete(plugin);
      }
    }

    if (sync) {
      return missing[this._type];
    }
  }

  shutdownPlugins () {
    return this._bulkUnload([ ...vizality.pluginManager.plugins.keys() ]);
  }

  _sortPlugins (pluginA, pluginB) {
    const priority = [ 'vz-updater', 'vz-addons-manager', 'vz-settings', 'vz-commands', 'vz-router', 'vz-dnt' ];
    const priorityA = priority.indexOf(pluginA);
    const priorityB = priority.indexOf(pluginB);
    return (priorityA === priorityB ? 0 : (priorityA < priorityB ? 1 : -1));
  }

  async _bulkUnload (plugins) {
    const nextPlugins = [];
    for (const plugin of plugins) {
      const deps = this.get(plugin).allDependencies;
      if (deps.filter(dep => this.get(dep) && this.get(dep)._ready).length !== 0) {
        nextPlugins.push(plugin);
      } else {
        await this.unmount(plugin);
      }
    }

    if (nextPlugins.length !== 0) {
      await this._bulkUnload(nextPlugins);
    }
  }

  log (...data) {

  }

  warn (...data) {

  }

  error (...data) {

  }
}

module.exports = AddonManager;