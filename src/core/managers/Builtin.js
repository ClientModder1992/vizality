import { resolve } from 'path';

import { Directories } from '@vizality/constants';

import AddonManager from './Addon';

export default class BuiltinManager extends AddonManager {
  constructor (type, dir) {
    type = 'builtins';
    dir = Directories.BUILTINS;

    super(type, dir);

    delete this._requiredManifestKeys;
  }

  async mount (addonId) {
    try {
      const addonModule = await import(resolve(this.dir, addonId));
      const AddonClass = addonModule && addonModule.__esModule ? addonModule.default : addonModule;

      Object.defineProperties(AddonClass.prototype, {
        addonId: {
          get: () => addonId
        }
      });

      this.items.set(addonId, new AddonClass());
    } catch (err) {
      this._error(`An error occurred while initializing "${addonId}"!`, err);
    }
  }

  _sort (addonA, addonB) {
    const priority = [ 'vz-privacy', 'vz-router', 'vz-commands', 'vz-dashboard', 'vz-addon-manager', 'vz-attributes', 'vz-notices', 'vz-rpc', 'vz-quick-code', 'vz-enhancements', 'vz-settings', 'vz-updater' ].reverse();
    const priorityA = priority.indexOf(addonA);
    const priorityB = priority.indexOf(addonB);
    return (priorityA === priorityB ? 0 : (priorityA < priorityB ? 1 : -1));
  }

  _setIcon () {
    return void 0;
  }
}
