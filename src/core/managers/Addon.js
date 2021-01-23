import { readdirSync, existsSync, stat } from 'fs';
import { watch } from 'chokidar';
import { resolve } from 'path';
import { sep } from 'path';

import { toSingular, toTitleCase, toHash } from '@vizality/util/string';
import { log, warn, error } from '@vizality/util/logger';
import { removeDirRecursive } from '@vizality/util/file';
import { Avatars } from '@vizality/constants';

const requiredManifestKeys = [ 'name', 'version', 'description', 'author' ];

export default class AddonManager {
  constructor (type, dir) {
    this.dir = dir;
    this.type = type;
    this.items = new Map();

    this._watcherEnabled = null;
    this._watcher = {};
    this._module = 'Manager';
    this._submodule = toSingular(this.type);
  }

  get count () {
    return this.items.size;
  }

  get values () {
    return this.items.values();
  }

  get keys () {
    return [ ...this.items.keys() ];
  }

  has (addonId) {
    return this.items.has(addonId);
  }

  get (addonId) {
    return this.items.get(addonId);
  }

  getAll () {
    return this.items;
  }

  isInstalled (addonId) {
    return this.has(addonId);
  }

  isEnabled (addonId) {
    return !vizality.settings.get(`disabled${toTitleCase(this.type)}`, [])
      .filter(addon => this.isInstalled(addon))
      .includes(addonId);
  }

  isDisabled (addonId) {
    return !this.isEnabled(addonId);
  }

  hasSettings (addonId) {
    try {
      const addon = this.get(addonId);
      if (!addon) throw new Error(`${toSingular(toTitleCase(this.type))} "${addonId}" is not installed!`);

      return Boolean(addon.sections?.settings);
    } catch (err) {
      this.error(`An error occurred while checking for settings for "${addonId}"!`, err);
    }
  }

  getEnabledKeys () {
    const addons = this.keys;
    return addons.filter(addon => this.isEnabled(addon));
  }

  getEnabled () {
    const enabled = new Map();
    this.getEnabledKeys()
      .sort((a, b) => a - b)
      .map(addon => this.get(addon))
      .forEach(addon => enabled.set(addon.addonId, addon));

    return enabled;
  }

  getDisabledKeys () {
    const addons = this.keys;
    return addons.filter(addon => this.isDisabled(addon));
  }

  getDisabled () {
    const disabled = new Map();
    this.getDisabledKeys()
      .sort((a, b) => a - b)
      .map(addon => this.get(addon))
      .forEach(addon => disabled.set(addon.addonId, addon));

    return disabled;
  }

  // Mount/load/enable/install
  async mount (addonId) {
    let manifest;
    try {
      manifest = Object.assign({
        appMode: 'app'
      }, await import(resolve(this.dir, addonId, 'manifest.json')));
    } catch (err) {
      return this._error(`${toSingular(toTitleCase(this.type))} "${addonId}" doesn't have a valid manifest. Skipping...`);
    }

    if (!requiredManifestKeys.every(key => manifest.hasOwnProperty(key))) {
      return this._error(`${toSingular(toTitleCase(this.type))} "${addonId}" doesn't have a valid manifest. Skipping...`);
    }

    try {
      const addonModule = await import(resolve(this.dir, addonId));
      const AddonClass = addonModule && addonModule.__esModule ? addonModule.default : addonModule;

      Object.defineProperties(AddonClass.prototype, {
        addonId: {
          get: () => addonId,
          set: () => {
            throw new Error(`${toTitleCase(this.type)} cannot update their ID at runtime!`);
          }
        },
        manifest: {
          get: () => manifest,
          set: () => {
            throw new Error(`${toTitleCase(this.type)} cannot update manifest at runtime!`);
          }
        }
      });

      this._setIcon(manifest, addonId);

      this.items.set(addonId, new AddonClass());
    } catch (err) {
      this._error(`An error occurred while initializing "${addonId}"!`, err);
    }
  }

  async unmount (addonId, showLogs = true) {
    try {
      const addon = this.get(addonId);
      if (!addon) {
        throw new Error(`Tried to unmount a non-installed ${toSingular(this.type)} "${addon}"!`);
      }

      await addon._unload(showLogs);

      Object.keys(require.cache).forEach(key => {
        if (key.includes(addonId)) {
          delete require.cache[key];
        }
      });

      this.items.delete(addonId);
    } catch (err) {
      this._error(`An error occurred while unmounting "${addonId}"!`, err);
    }
  }

  async remount (addonId, showLogs = true) {
    try {
      await this.unmount(addonId, showLogs);
    } catch (err) {
      this._error(`An error occurred while remounting "${addonId}"!`, err);
    }
    /*
     * I have these separated because it seems to cause problems if they're not for some
     * reason. Not confirmed yet though.
     */
    try {
      await this.mount(addonId);
      await this.get(addonId)?._load(showLogs);
    } catch (err) {
      this._error(`An error occurred while remounting "${addonId}"!`, err);
    }
  }

  async remountAll () {
    try {
      const addons = this.getEnabledKeys();
      for (const addon of addons) {
        await this.remount(addon, false);
      }
    } catch (err) {
      this._error(`An error occurred while remounting all ${this.type}!`, err);
    }

    this._log(`All ${this.type} have been re-initialized!`);
  }

  // Start/Stop
  async initialize () {
    let addonId;
    // await this._enableWatcher();

    // if (this._watcherEnabled) {
    //   await this._watchFiles();
    // }

    try {
      const files = readdirSync(this.dir);
      for (const filename of files) {
        if (filename.startsWith('.')) {
          continue;
        }

        addonId = filename;

        await this.mount(addonId);
        // If addon didn't mount
        if (!this.get(addonId)) {
          continue;
        }

        if (!this.getDisabledKeys().includes(addonId)) {
          await this.get(addonId)._load();
        }
      }
    } catch (err) {
      this._error(`An error occurred while initializing "${addonId}"!`, err);
    }
  }

  async terminate () {
    try {
      this._disableWatcher();
      const addons = this.keys;
      for (const addon of addons) {
        await this.unmount(addon, false);
      }
    } catch (err) {
      return this._log(`There was a problem shutting down ${this.type}!`, err);
    }
    return this._log(`All ${this.type} have been unloaded!`);
  }

  async enable (addonId) {
    const addon = this.get(addonId);

    if (!addon) {
      throw new Error(`Tried to enable a non-installed ${toSingular(this.type)} "${addonId}"!`);
    }

    if ((this.type === 'plugins' || this.type === 'builtins') && addon._ready) {
      return this._error(`Tried to load an already-loaded ${toSingular(this.type)} "${addonId}"!`);
    }

    vizality.settings.set(`disabled${toTitleCase(this.type)}`,
      vizality.settings.get(`disabled${toTitleCase(this.type)}`, [])
        .filter(addon => addon !== addonId));

    await addon._load('enabled');
  }

  async disable (addonId) {
    const addon = this.get(addonId);

    if (!addon) {
      throw new Error(`Tried to disable a non-installed ${toSingular(this.type)} "${addonId}"!`);
    }

    if ((this.type === 'plugins' || this.type === 'builtins') && !addon._ready) {
      return this._error(`Tried to unload a non-loaded ${toSingular(this.type)} "${addon}"!`);
    }

    vizality.settings.set(`disabled${toTitleCase(this.type)}`, [
      ...vizality.settings.get(`disabled${toTitleCase(this.type)}`, []),
      addonId
    ]);

    await addon._unload('disabled');
  }

  async reload (addonId) {
    await this.disable(addonId);
    await this.enable(addonId);
  }

  async reloadAll () {
    const addons = this.getEnabled();
    for (const addon of addons) {
      await this.reload(addon);
    }
  }

  async enableAll () {
    const addons = this.getDisabled();
    for (const addon of addons) {
      await this.enable(addon);
    }
  }

  async disableAll () {
    const addons = this.getEnabled();
    for (const addon of addons) {
      await this.disable(addon);
    }
  }

  /** @private */
  async install (addonId) {
    throw new Error('no');
  }

  /** @private */
  async _uninstall (addonId) {
    await this.unmount(addonId);
    await removeDirRecursive(resolve(this.dir, addonId));
  }

  /** @private */
  async _setIcon (manifest, addonId) {
    if (manifest.icon) {
      return manifest.icon = `vz-${toSingular(this.type)}://${addonId}/${manifest.icon}`;
    }

    const validExtensions = [ '.png', '.jpg', '.jpeg', '.webp' ];

    if (validExtensions.some(ext => existsSync(resolve(this.dir, addonId, 'assets', `icon${ext}`)))) {
      for (const ext of validExtensions) {
        if (existsSync(resolve(this.dir, addonId, 'assets', `icon${ext}`))) {
          return manifest.icon = `vz-${toSingular(this.type)}://${addonId}/assets/icon${ext}`;
        }
      }
    } else {
      const addonIdHash = toHash(addonId);
      return manifest.icon = Avatars[`DEFAULT_${toSingular(this.type.toUpperCase())}_${(addonIdHash % 5) + 1}`];
    }
  }

  /**
   * Enables the addon directory watcher.
   * @private
   */
  // async _enableWatcher () {
  //   this._watcherEnabled = true;
  // }

  // /**
  //  * Disables the file watcher. MUST be called if you no longer need the compiler and the watcher
  //  * was previously enabled.
  //  * @private
  //  */
  // async _disableWatcher () {
  //   this._watcherEnabled = false;
  //   if (this._watcher?.close) {
  //     await this._watcher.close();
  //     this._watcher = {};
  //   }
  // }

  // /**
  //  * @private
  //  */
  // async _watchFiles () {
  //   this._watcher = watch(this.dir, {
  //     ignored: [ /.exists/ ],
  //     ignoreInitial: true,
  //     depth: 0
  //   });

  //   /**
  //    * Makes sure that the directory added has been completely copied by the operating
  //    * system before it attempts to do anything with the addon.
  //    * @see {@link https://memorytin.com/2015/07/08/node-js-chokidar-wait-for-file-copy-to-complete-before-modifying/}
  //    */
  //   const _this = this;
  //   function checkAddDirComplete (path, prev) {
  //     stat(path, async (err, stat) => {
  //       if (err) {
  //         throw err;
  //       }
  //       if (stat.mtime.getTime() === prev.mtime.getTime()) {
  //         const addonId = path.replace(_this.dir + sep, '');
  //         try {
  //           await _this.mount(addonId).catch(() => void 0);
  //           await _this.get(addonId)._load().catch(() => void 0);
  //           return this._log(`${toSingular(this.type)} "${addonId}" has been installed!`);
  //         } catch (err) {}
  //       } else {
  //         setTimeout(checkAddDirComplete, 1000, path, stat);
  //       }
  //     });
  //   }

  //   this._watcher
  //     .on('addDir', (path, stat) => setTimeout(checkAddDirComplete, 1000, path, stat))
  //     .on('unlinkDir', path => {
  //       const addonId = path.replace(this.dir + sep, '');
  //       Object.keys(require.cache).forEach(key => {
  //         if (key.includes(addonId)) {
  //           delete require.cache[key];
  //         }
  //       });

  //       this.items.delete(addonId);
  //     });
  // }

  /** @private */
  _log (...data) {
    log(this._module, this._submodule, null, ...data);
  }

  /** @private */
  _warn (...data) {
    warn(this._module, this._submodule, null, ...data);
  }

  /** @private */
  _error (...data) {
    error(this._module, this._submodule, null, ...data);
  }
}
