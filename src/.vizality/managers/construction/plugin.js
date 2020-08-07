const { file: { rmdirRf } } = require('@utilities');
const { PLUGINS_FOLDER } = require('@constants');

const { resolve } = require('path');
const { readdirSync } = require('fs');

const AddonManager = require('./addon');

class Plugin extends AddonManager {
  constructor (type, dir) {
    super(type, dir);

    this.type = 'plugin';
    this.dir = PLUGINS_FOLDER;
  }

  // Mount/load/enable/install shit
  mount (pluginId) {
    let manifest;
    try {
      manifest = Object.assign({
        appMode: 'app',
        dependencies: [],
        optionalDependencies: []
      }, require(resolve(this.dir, pluginId, 'manifest.json')));
    } catch (e) {
      return this.error(`Plugin ${pluginId} doesn't have a valid manifest - Skipping`);
    }

    if (!this._getRequiredManifestKeys.every(key => manifest.hasOwnProperty(key))) {
      return this.error(`Plugin ${pluginId} doesn't have a valid manifest - Skipping`);
    }

    try {
      const PluginClass = require(resolve(this.dir, pluginId));
      Object.defineProperties(PluginClass.prototype, {
        entityID: {
          get: () => pluginId,
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

      this.plugins.set(pluginId, new PluginClass());
    } catch (err) {
      this.error(`An error occurred while initializing "${pluginId}"!`, err);
    }
  }

  async remount (pluginId) {
    try {
      await this.unmount(pluginId);
    } catch (e) {
      // chhhh
    }
    this.mount(pluginId);
    this.plugins.get(pluginId)._load();
  }

  // Start
  _start (sync = false) {
    const missingPlugins = [];
    const isOverlay = (/overlay/).test(location.pathname);
    readdirSync(this.dir).sort(this._sortPlugins).forEach(filename => !this.isInstalled(filename) && this.mount(filename));
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

  _stop () {
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
}

module.exports = Plugin;
