import { readdirSync, existsSync } from 'fs';
import { resolve } from 'path';

import { toSingular, toTitleCase, toHash } from '@vizality/util/string';
import { log, warn, error } from '@vizality/util/logger';
import { removeDirRecursive } from '@vizality/util/file';
import { Avatars } from '@vizality/constants';

const ErrorTypes = {
  NOT_A_DIRECTORY: 'NOT A DIRECTOR',
  MANIFEST_LOAD_FAILED: 'MANIFEST_LOAD_FAILED',
  INVALID_MANIFEST: 'INVALID_MANIFEST',
  ENABLE_NON_INSTALLED: 'ENABLE_NON_INSTALLED',
  ENABLE_ALREADY_ENABLED: 'ENABLE_ALREADY_ENABLED',
  DISABLE_NON_INSTALLED: 'DISABLE_NON_INSTALLED',
  DISABLE_NON_ENABLED: 'DISABLE_NON_ENABLED'
};

export default class AddonManager {
  constructor (type, dir) {
    this.dir = dir;
    this.type = type;
    this.items = new Map();

    this._requiredManifestKeys = [ 'name', 'version', 'description', 'author' ];
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
    return this.keys;
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

  getAllEnabled () {
    const addons = this.getAll();
    return addons.filter(addon => this.isEnabled(addon));
  }

  getAllDisabled () {
    const addons = this.getAll();
    return addons.filter(addon => this.isDisabled(addon));
  }

  // Mount/load/enable/install
  async mount (addonId) {
    let manifest;
    try {
      manifest = Object.assign({
        appMode: 'app',
        dependencies: [],
        optionalDependencies: []
      }, await import(resolve(this.dir, addonId, 'manifest.json')));
    } catch (err) {
      return this._error(`${toSingular(toTitleCase(this.type))} ${addonId} doesn't have a valid manifest. Skipping...`);
    }

    if (!this._requiredManifestKeys.every(key => manifest.hasOwnProperty(key))) {
      return this._error(`${toSingular(toTitleCase(this.type))} ${addonId} doesn't have a valid manifest. Skipping...`);
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

  async remount (addonId) {
    try {
      await this.unmount(addonId);
    } catch (err) {
      // chhhh
    }
    await this.mount(addonId);
    this.get(addonId)._load();
  }

  async remountAll () {
    const addons = this.getAllEnabled();
    for (const addon of addons) {
      await this.remount(addon);
    }
  }

  async unmount (addonId) {
    const addon = this.get(addonId);

    if (!addon) {
      throw new Error(`Tried to unmount a non-installed ${toSingular(this.type)}: ${addon}`);
    }

    await addon._unload();

    Object.keys(require.cache).forEach(key => {
      if (key.includes(addonId)) {
        delete require.cache[key];
      }
    });

    this.items.delete(addonId);
  }

  // Start/Stop
  async initialize (sync = false) {
    const missingThemes = [];
    const files = readdirSync(this.dir);
    for (const filename of files) {
      if (filename.startsWith('.')) {
        continue;
      }

      const addonId = filename;

      if (!sync) {
        await this.mount(addonId);

        // If addon didn't mount
        if (!this.get(addonId)) {
          continue;
        }
      }

      if (!this.getAllDisabled().includes(addonId)) {
        if (sync && !this.isInstalled(addonId)) {
          await this.mount(addonId);
          missingThemes.push(addonId);
        }

        this.get(addonId)._load();
      }
    }

    if (sync) {
      return missingThemes;
    }
  }

  async terminate () {
    const addons = this.getAllEnabled();
    for (const addon of addons) {
      await this.unmount(addon);
    }

    return this._log(`All ${this.type} have been unloaded.`);
  }

  async enable (addonId) {
    const addon = this.get(addonId);

    if (!addon) {
      throw new Error(`Tried to enable a non-installed ${toSingular(this.type)}: (${addonId})`);
    }

    if (this.type !== 'themes' && addon._ready) {
      return this._error(`Tried to load an already-loaded ${toSingular(this.type)}: (${addonId})`);
    }

    vizality.settings.set(`disabled${toTitleCase(this.type)}`,
      vizality.settings.get(`disabled${toTitleCase(this.type)}`, [])
        .filter(addon => addon !== addonId));

    addon._load();
  }

  async disable (addonId) {
    const addon = this.get(addonId);

    if (!addon) {
      throw new Error(`Tried to disable a non-installed ${toSingular(this.type)}: (${addonId})`);
    }

    if (this.type !== 'themes' && !addon._ready) {
      return this._error(`Tried to unload a non-loaded ${toSingular(this.type)}: (${addon})`);
    }

    vizality.settings.set(`disabled${toTitleCase(this.type)}`, [
      ...vizality.settings.get(`disabled${toTitleCase(this.type)}`, []),
      addonId
    ]);

    addon._unload();
  }

  async reload (addonId) {
    await this.disable(addonId);
    await this.enable(addonId);
  }

  async reloadAll () {
    const addons = this.getAllEnabled();
    for (const addon of addons) {
      await this.reload(addon);
    }
  }

  enableAll () {
    const addons = this.getAllDisabled();
    addons.forEach(addon => this.enable(addon));
  }

  disableAll () {
    const addons = this.getAllEnabled();
    addons.forEach(addon => this.disable(addon));
  }

  async install (addonId) {
    throw new Error('no');
  }

  async _uninstall (addonId) {
    await this.unmount(addonId);
    await removeDirRecursive(resolve(this.dir, addonId));
  }

  _handleError (errorType, args) {
    if (window.__SPLASH__ || window.__OVERLAY__) {
      return;
    }

    switch (errorType) {
      case ErrorTypes.NOT_A_DIRECTORY:
        vizality.api.notices.sendToast('vz-styleManager-invalid-theme', {
          header: `"${args[0]}" is a file`,
          content: 'Make sure all of your theme files are in a subfolder.',
          type: 'error',
          buttons: [
            /*
             * {
             *   text: 'Documentation',
             *   color: 'green',
             *   look: 'ghost',
             *   onClick: () => console.log('yes')
             * },
             */
          ]
        });
        break;
      case ErrorTypes.MANIFEST_LOAD_FAILED:
        vizality.api.notices.sendToast('sm-invalid-theme', {
          header: `Failed to load manifest for "${args[0]}"`,
          content: 'This is most likely due to a syntax error in the file. Check console for more details.',
          type: 'error',
          buttons: [
            {
              text: 'Open Developer Tools',
              color: 'green',
              look: 'ghost',
              onClick: () => vizality.native.openDevTools()
            }
          ]
        });
        break;
      case ErrorTypes.INVALID_MANIFEST:
        vizality.api.notices.sendToast('sm-invalid-theme', {
          header: `Invalid manifest for "${args[0]}"`,
          content: 'Check the console for more details.',
          type: 'error',
          buttons: [
            {
              text: 'Open Developer Tools',
              color: 'green',
              look: 'ghost',
              onClick: () => vizality.native.openDevTools()
            }
          ]
        });
        break;
    }
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

  _log (...data) {
    log(this._module, this._submodule, null, ...data);
  }

  _warn (...data) {
    warn(this._module, this._submodule, null, ...data);
  }

  _error (...data) {
    error(this._module, this._submodule, null, ...data);
  }
}
