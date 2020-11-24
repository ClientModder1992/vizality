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
};
