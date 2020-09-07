const { file: { removeDirRecursive }, string: { toSingular, toHeaderCase }, logger: { log, warn, error } } = require('@util');

const { readdirSync } = require('fs');
const { resolve } = require('path');

const _module = 'AddonManager';

class AddonManager {
  constructor (type, dir) {
    this._dir = dir;
    this._type = type;
    this._requiredManifestKeys = [ 'name', 'version', 'description', 'author' ];

    this[type] = new Map();
  }

  get count () {
    return this[this._type].size;
  }

  get values () {
    return this[this._type].values();
  }

  get keys () {
    return this[this._type].keys();
  }

  get (addonId) {
    return this[this._type].get(addonId);
  }

  has (addonId) {
    return this[this._type].has(addonId);
  }

  getAll () {
    return [
      ...this[this._type].keys(),
      ...this.getAllDisabled()
    ];
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
    return [ ...this[this._type].keys() ];
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
    } catch (err) {
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

      this.plugins.set(pluginID, new PluginClass());
    } catch (err) {
      this.error(`An error occurred while initializing "${pluginID}"!`, err);
    }
  }

  async remount (pluginID) {
    try {
      await this.unmount(pluginID);
    } catch (err) {
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

  enable (addonId) {
    const addon = this.get(addonId);

    if (!addon) {
      throw new Error(`Tried to enable a non-installed ${toSingular(this._type)}: (${addonId})`);
    }

    if (addon._ready) {
      return this.error(`Tried to load an already-loaded ${toSingular(this._type)}: (${addonId})`);
    }

    vizality.settings.set(
      'disabledPlugins',
      vizality.settings.get('disabledPlugins', []).filter(p => p !== addonId)
    );

    addon._load();
  }

  disable (addonId) {
    const addon = this.get(addonId);

    if (!addon) {
      throw new Error(`Tried to disable a non-installed ${toSingular(this._type)}: (${addonId})`);
    }

    if (!addon._ready) {
      return this.error(`Tried to unload a non-loaded ${toSingular(this._type)}: (${plugin})`);
    }

    vizality.settings.set('disabledPlugins', [
      ...vizality.settings.get('disabledPlugins', []),
      addonId
    ]);

    addon._unload();
  }

  async install (addonId) {
    throw new Error('no');
  }

  async uninstall (addonId) {
    if (this.isInternal(addonId)) {
      throw new Error(`You cannot uninstall an internal ${toSingular(this._type)}. (Tried to uninstall: ${addonId})`);
    }

    await this.unmount(addonId);
    await removeDirRecursive(resolve(this._dir, addonId));
  }

  // Start
  load (sync = false) {
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
          this.enable(plugin.entityID);
          missing[this._type].push(plugin.entityID);
        } else if (!sync) {
          this.enable(plugin.entityID);
        }
      } else {
        this[this._type].delete(plugin);
      }
    }

    if (sync) {
      return missing[this._type];
    }
  }

  unload () {
    return this._bulkUnload([ ...vizality.manager.plugins.keys ]);
  }

  _sortPlugins (pluginA, pluginB) {
    const priority = [ 'vz-updater', 'vz-addon-manager', 'vz-settings', 'vz-dashboard', 'vz-commands', 'vz-router', 'vz-dnt' ];
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
    log(_module, this._type, null, ...data);
  }

  warn (...data) {
    warn(_module, this._type, null, ...data);
  }

  error (...data) {
    error(_module, this._type, null, ...data);
  }
}

module.exports = AddonManager;
