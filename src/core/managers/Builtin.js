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

  _setIcon () {
    return void 0;
  }
}
