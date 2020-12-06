const { readdirSync } = require('fs');
const { resolve } = require('path');

const { Directories } = require('@vizality/constants');

const AddonManager = require('../../addon');

module.exports = class BuiltinManager extends AddonManager {
  constructor (type, dir) {
    type = 'builtins';
    dir = Directories.BUILTINS;

    super(type, dir);
  }

  load (sync = false) {
    const missing = {};
    missing[this._type] = [];

    const isOverlay = (/overlay/).test(location.pathname);
    readdirSync(this._dir).forEach(filename =>/*!this.isInstalled(filename) &&*/ this.mount(filename));
    for (const plugin of [ ...this[this._type].values() ]) {
      if (vizality.settings.get('disabledPlugins', []).includes(plugin.addonId)) {
        continue;
      }
      if (
        (plugin.manifest.appMode === 'overlay' && isOverlay) ||
        (plugin.manifest.appMode === 'app' && !isOverlay) ||
        plugin.manifest.appMode === 'both'
      ) {
        if (sync && !this.get(plugin.addonId)._ready) {
          this.enable(plugin.addonId);
          missing[this._type].push(plugin.addonId);
        } else if (!sync) {
          this.enable(plugin.addonId);
        }
      } else {
        this[this._type].delete(plugin);
      }
    }

    if (sync) {
      return missing[this._type];
    }
  }
};
