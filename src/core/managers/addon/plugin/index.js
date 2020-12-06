const { readdirSync } = require('fs');
const { resolve } = require('path');

const { Directories } = require('@vizality/constants');

const AddonManager = require('../../addon');

module.exports = class PluginManager extends AddonManager {
  constructor (type, dir) {
    type = 'plugins';
    dir = Directories.PLUGINS;

    super(type, dir);
  }

  // load (sync = false) {
  //   const missing = {};
  //   missing[this._type] = [];

  //   const isOverlay = (/overlay/).test(location.pathname);
  //   readdirSync(this._dir).forEach(filename =>/*!this.isInstalled(filename) &&*/ this.mount(filename));
  //   for (const plugin of [ ...this[this._type].values() ]) {
  //     if (vizality.settings.get('disabledPlugins', []).includes(plugin.addonId)) {
  //       continue;
  //     }
  //     if (
  //       (plugin.manifest.appMode === 'overlay' && isOverlay) ||
  //       (plugin.manifest.appMode === 'app' && !isOverlay) ||
  //       plugin.manifest.appMode === 'both'
  //     ) {
  //       if (sync && !this.get(plugin.addonId)._ready) {
  //         this.enable(plugin.addonId);
  //         missing[this._type].push(plugin.addonId);
  //       } else if (!sync) {
  //         this.enable(plugin.addonId);
  //       }
  //     } else {
  //       this[this._type].delete(plugin);
  //     }
  //   }

  //   if (sync) {
  //     return missing[this._type];
  //   }
  // }

  terminate () {
    return this._bulkUnload([ ...vizality.manager.plugins.keys ]);
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
};
