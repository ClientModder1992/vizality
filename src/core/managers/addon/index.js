const { readdirSync } = require('fs');
const { resolve } = require('path');

const { file: { removeDirRecursive }, string: { toSingular, toTitleCase, toHash }, logger: { log, warn, error } } = require('@vizality/util');
const { Avatars } = require('@vizality/constants');

const _module = 'Manager';

module.exports = class AddonManager {
  constructor (type, dir) {
    this.dir = dir;
    this.type = type;
    this.requiredManifestKeys = [ 'name', 'version', 'description', 'author' ];

    this[type] = new Map();
  }

  get count () {
    return this[this.type].size;
  }

  get values () {
    return this[this.type].values();
  }

  get keys () {
    return this[this.type].keys();
  }

  get (addonId) {
    return this[this.type].get(addonId);
  }

  getAll () {
    return [ ...this[this.type].keys() ];
  }

  isInstalled (addonId) {
    return this[this.type].has(addonId);
  }

  isEnabled (addonId) {
    return !vizality.settings.get(`disabled${toTitleCase(this.type)}`, []).includes(addonId);
  }

  getAllEnabled () {
    const addons = [ ...this[this.type].keys() ];
    return addons.filter(addon => !this.getAllDisabled().includes(addon));
  }

  getAllDisabled () {
    return vizality.settings.get(`disabled${toTitleCase(this.type)}`, []);
  }

  // Mount/load/enable/install
  mount (addonId) {
    let manifest;
    try {
      manifest = Object.assign({
        appMode: 'app',
        dependencies: [],
        optionalDependencies: []
      }, require(resolve(this.dir, addonId, 'manifest.json')));
    } catch (err) {
      return this.error(`${toSingular(toTitleCase(this.type))} ${addonId} doesn't have a valid manifest - Skipping`);
    }

    if (!this.requiredManifestKeys.every(key => manifest.hasOwnProperty(key))) {
      return this.error(`${toSingular(toTitleCase(this.type))} ${addonId} doesn't have a valid manifest - Skipping`);
    }

    try {
      const AddonClass = require(resolve(this.dir, addonId));
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

      this[this.type].set(addonId, new AddonClass());
    } catch (err) {
      this.error(`An error occurred while initializing "${addonId}"!`, err);
    }
  }

  async remount (addonId) {
    try {
      await this.unmount(addonId);
    } catch (err) {
      // chhhh
    }
    this.mount(addonId);
    this[this.type].get(addonId)._load();
  }

  async unmount (addonId) {
    const plugin = this.get(addonId);
    if (!plugin) {
      throw new Error(`Tried to unmount a non-installed ${toSingular(this.type)}: ${plugin}`);
    }
    if (plugin._ready) {
      await plugin._unload();
    }

    Object.keys(require.cache).forEach(key => {
      if (key.includes(addonId)) {
        delete require.cache[key];
      }
    });
    this[this.type].delete(addonId);
  }

  // Start/Stop
  async load (sync = false) {
    const missingThemes = [];
    const files = readdirSync(this.dir);
    for (const filename of files) {
      if (filename.startsWith('.')) {
        console.debug('%c[Vizality:AddonManager]', 'color: #7289da', 'Ignoring dotfile', filename);
        continue;
      }

      const addonId = filename.split('.').shift();
      if (!sync) {
        await this.mount(addonId, filename);

        // if theme didn't mounted
        if (!this[this.type].get(addonId)) {
          continue;
        }
      }

      if (!this.getAllDisabled().includes(addonId)) {
        if (sync && !this.isInstalled(addonId)) {
          await this.mount(addonId, filename);
          missingThemes.push(addonId);
        }

        this[this.type].get(addonId)._load();
      }
    }

    if (sync) {
      return missingThemes;
    }
  }

  enable (addonId) {
    const addon = this.get(addonId);

    if (!addon) {
      throw new Error(`Tried to enable a non-installed ${toSingular(this.type)}: (${addonId})`);
    }

    if (this.type !== 'themes' && addon._ready) {
      return this.error(`Tried to load an already-loaded ${toSingular(this.type)}: (${addonId})`);
    }

    vizality.settings.set(`disabled${toTitleCase(this.type)}`, vizality.settings.get(`disabled${toTitleCase(this.type)}`, [])
      .filter(addon => addon !== addonId));

    addon._load();
  }

  disable (addonId) {
    const addon = this.get(addonId);

    if (!addon) {
      console.log(addonId);
      console.log(addon);
      throw new Error(`Tried to disable a non-installed ${toSingular(this.type)}: (${addonId})`);
    }

    if (this.type !== 'themes' && !addon._ready) {
      return this.error(`Tried to unload a non-loaded ${toSingular(this.type)}: (${addon})`);
    }

    vizality.settings.set(`disabled${toTitleCase(this.type)}`, [ ...vizality.settings.get(`disabled${toTitleCase(this.type)}`, []), addonId ]);

    addon._unload();
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

  async uninstall (addonId) {
    await this.unmount(addonId);
    await removeDirRecursive(resolve(this.dir, addonId));
  }

  _handleError (errorType, args) {
    if (window.__SPLASH__ || window.__OVERLAY__) {
      return; // Consider an alternative logging method?
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

  _setIcon (manifest, addonId) {
    if (manifest.icon) {
      manifest.icon = `vz-${toSingular(this.type)}://${addonId}/${manifest.icon}`;
    } else {
      const addonIdHash = toHash(addonId);
      let iconIdentifier;
      if (addonIdHash % 10 === 0 || addonIdHash % 10 === 1) iconIdentifier = 1;
      if (addonIdHash % 10 === 2 || addonIdHash % 10 === 3) iconIdentifier = 2;
      if (addonIdHash % 10 === 4 || addonIdHash % 10 === 5) iconIdentifier = 3;
      if (addonIdHash % 10 === 6 || addonIdHash % 10 === 7) iconIdentifier = 4;
      if (addonIdHash % 10 === 8 || addonIdHash % 10 === 9) iconIdentifier = 5;
      manifest.icon = Avatars[`DEFAULT_${toSingular(this.type.toUpperCase())}_${iconIdentifier}`];
    }
  }

  log (...data) { log(_module, toSingular(this.type), null, ...data); }
  warn (...data) { warn(_module, toSingular(this.type), null, ...data); }
  error (...data) { error(_module, toSingular(this.type), null, ...data); }
};
