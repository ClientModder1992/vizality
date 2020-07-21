const { file: { rmdirRf } } = require('@util');
const { ROOT_FOLDER } = require('@constants');

const { resolve } = require('path');
const { readdirSync } = require('fs');

class PluginManager {
  constructor () {
    this.pluginDir = resolve(ROOT_FOLDER, 'addons', 'plugins');
    this.plugins = new Map();

    this.manifestKeys = [ 'name', 'version', 'description', 'author', 'license' ];
  }

  // Getters
  get (pluginID) {
    return this.plugins.get(pluginID);
  }

  getPlugins () {
    return [ ...this.plugins.keys() ];
  }

  isInstalled (plugin) {
    return this.plugins.has(plugin);
  }

  isEnabled (plugin) {
    return !vizality.settings.get('disabledPlugins', []).includes(plugin);
  }

  // Mount/load/enable/install shit
  mount (pluginID) {
    let manifest;
    try {
      manifest = Object.assign({
        appMode: 'app',
        dependencies: [],
        optionalDependencies: []
      }, require(resolve(this.pluginDir, pluginID, 'manifest.json')));
    } catch (e) {
      return this.error(`Plugin ${pluginID} doesn't have a valid manifest - Skipping`);
    }

    if (!this.manifestKeys.every(key => manifest.hasOwnProperty(key))) {
      return this.error(`Plugin ${pluginID} doesn't have a valid manifest - Skipping`);
    }

    try {
      const PluginClass = require(resolve(this.pluginDir, pluginID));
      Object.defineProperties(PluginClass.prototype, {
        entityID: {
          get: () => pluginID,
          set: () => {
            throw new Error('Plugins cannot update their ID at runtime!');
          }
        },
        manifest: {
          get: () => manifest,
          set: () => {
            throw new Error('Plugins cannot update manifest at runtime!');
          }
        }
      });

      this.plugins.set(pluginID, new PluginClass());
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
    this.plugins.get(pluginID)._load();
  }

  async unmount (pluginID) {
    const plugin = this.get(pluginID);
    if (!plugin) {
      throw new Error(`Tried to unmount a non installed plugin (${plugin})`);
    }
    if (plugin.ready) {
      await plugin._unload();
    }

    Object.keys(require.cache).forEach(key => {
      if (key.includes(pluginID)) {
        delete require.cache[key];
      }
    });
    this.plugins.delete(pluginID);
  }

  // Load
  load (pluginID) {
    const plugin = this.get(pluginID);
    if (!plugin) {
      throw new Error(`Tried to load a non-installed plugin: (${plugin})`);
    }
    if (plugin.ready) {
      return this.error(`Tried to load an already-loaded plugin: (${pluginID})`);
    }

    plugin._load();
  }

  unload (pluginID) {
    const plugin = this.get(pluginID);
    if (!plugin) {
      throw new Error(`Tried to unload a non-installed plugin: (${plugin})`);
    }
    if (!plugin.ready) {
      return this.error(`Tried to unload a non-loaded plugin: (${plugin})`);
    }

    plugin._unload();
  }

  // Enable
  enable (pluginID) {
    if (!this.get(pluginID)) {
      throw new Error(`Tried to enable a non-installed plugin: (${pluginID})`);
    }

    vizality.settings.set(
      'disabledPlugins',
      vizality.settings.get('disabledPlugins', []).filter(p => p !== pluginID)
    );

    this.load(pluginID);
  }

  disable (pluginID) {
    const plugin = this.get(pluginID);

    if (!plugin) {
      throw new Error(`Tried to disable a non-installed plugin: (${pluginID})`);
    }

    vizality.settings.set('disabledPlugins', [
      ...vizality.settings.get('disabledPlugins', []),
      pluginID
    ]);

    this.unload(pluginID);
  }

  // noinspection JSUnusedLocalSymbols - Install
  async install (pluginID) { // eslint-disable-line no-unused-vars
    throw new Error('no');
  }

  async uninstall (pluginID) {
    if (pluginID.startsWith('vz-')) {
      throw new Error(`You cannot uninstall an internal plugin. (Tried to uninstall: ${pluginID})`);
    }

    await this.unmount(pluginID);
    await rmdirRf(resolve(this.pluginDir, pluginID));
  }

  // Start
  startPlugins (sync = false) {
    const missingPlugins = [];
    const isOverlay = (/overlay/).test(location.pathname);
    readdirSync(this.pluginDir).sort(this._sortPlugins).forEach(filename => !this.isInstalled(filename) && this.mount(filename));
    for (const plugin of [ ...this.plugins.values() ]) {
      if (vizality.settings.get('disabledPlugins', []).includes(plugin.entityID)) {
        continue;
      }
      if (
        (plugin.manifest.appMode === 'overlay' && isOverlay) ||
        (plugin.manifest.appMode === 'app' && !isOverlay) ||
        plugin.manifest.appMode === 'both'
      ) {
        if (sync && !this.get(plugin.entityID).ready) {
          this.load(plugin.entityID);
          missingPlugins.push(plugin.entityID);
        } else if (!sync) {
          this.load(plugin.entityID);
        }
      } else {
        this.plugins.delete(plugin);
      }
    }

    if (sync) {
      return missingPlugins;
    }
  }

  shutdownPlugins () {
    return this._bulkUnload([ ...vizality.pluginManager.plugins.keys() ]);
  }

  _sortPlugins (pluginA, pluginB) {
    const priority = [ 'vz-dnt', 'vz-router', 'vz-commands', 'vz-settings', 'vz-module-manager', 'vz-updater' ].reverse();
    const priorityA = priority.indexOf(pluginA);
    const priorityB = priority.indexOf(pluginB);
    return (priorityA === priorityB ? 0 : (priorityA < priorityB ? 1 : -1));
  }

  async _bulkUnload (plugins) {
    const nextPlugins = [];
    for (const plugin of plugins) {
      const deps = this.get(plugin).allDependencies;
      if (deps.filter(dep => this.get(dep) && this.get(dep).ready).length !== 0) {
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

module.exports = PluginManager;
