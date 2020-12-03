const { readdirSync } = require('fs');
const { resolve } = require('path');

const { file: { removeDirRecursive }, string: { toSingular, toTitleCase }, logger: { log, warn, error } } = require('@vizality/util');

const _module = 'AddonManager';

module.exports = class AddonManager {
  constructor (type, dir) {
    this._dir = dir;
    this._type = type;
    this._requiredManifestKeys = [ 'name', 'version', 'description', 'author' ];

    this[type] = new Map();
  }

  get count () {
    return this[this._type].size;
  }

  get values () {
    return this[this._type].values();
  }

  get keys () {
    return this[this._type].keys();
  }

  get (addonId) {
    return this[this._type].get(addonId);
  }

  getAll () {
    return [ ...this[this._type].keys() ];
  }

  isInstalled (addonId) {
    return this[this._type].has(addonId);
  }

  isEnabled (addonId) {
    return !vizality.settings.get(`disabled${toTitleCase(this._type)}`, []).includes(addonId);
  }

  getAllEnabled () {
    const addons = [ ...this[this._type].keys() ];
    return addons.filter(addon => !this.getAllDisabled().includes(addon));
  }

  getAllDisabled () {
    return vizality.settings.get(`disabled${toTitleCase(this._type)}`, []);
  }

  // Mount/load/enable/install shit
  mount (pluginID) {
    let manifest;
    try {
      manifest = Object.assign({
        appMode: 'app',
        dependencies: [],
        optionalDependencies: []
      }, require(resolve(this._dir, pluginID, 'manifest.json')));
    } catch (err) {
      return this.error(`${toSingular(toTitleCase(this._type))} ${pluginID} doesn't have a valid manifest - Skipping`);
    }

    if (!this._requiredManifestKeys.every(key => manifest.hasOwnProperty(key))) {
      return this.error(`${toSingular(toTitleCase(this._type))} ${pluginID} doesn't have a valid manifest - Skipping`);
    }

    try {
      const PluginClass = require(resolve(this._dir, pluginID));
      Object.defineProperties(PluginClass.prototype, {
        entityID: {
          get: () => pluginID,
          set: () => {
            throw new Error(`${toTitleCase(this._type)} cannot update their ID at runtime!`);
          }
        },
        manifest: {
          get: () => manifest,
          set: () => {
            throw new Error(`${toTitleCase(this._type)} cannot update manifest at runtime!`);
          }
        }
      });

      this[this._type].set(pluginID, new PluginClass());
    } catch (err) {
      this.error(`An error occurred while initializing "${pluginID}"!`, err);
    }
  }

  async remount (addonId) {
    try {
      await this.unmount(addonId);
    } catch (err) {
      // chhhh
    }
    this.mount(addonId);
    this[this._type].get(addonId)._load();
  }

  async unmount (addonId) {
    const plugin = this.get(addonId);
    if (!plugin) {
      throw new Error(`Tried to unmount a non-installed ${toSingular(this._type)}: ${plugin}`);
    }
    if (plugin._ready) {
      await plugin._unload();
    }

    Object.keys(require.cache).forEach(key => {
      if (key.includes(addonId)) {
        delete require.cache[key];
      }
    });
    this[this._type].delete(addonId);
  }

  enable (addonId) {
    const addon = this.get(addonId);

    if (!addon) {
      throw new Error(`Tried to enable a non-installed ${toSingular(this._type)}: (${addonId})`);
    }

    if (this._type !== 'themes' && addon._ready) {
      return this.error(`Tried to load an already-loaded ${toSingular(this._type)}: (${addonId})`);
    }

    vizality.settings.set(`disabled${toTitleCase(this._type)}`, vizality.settings.get(`disabled${toTitleCase(this._type)}`, [])
      .filter(addon => addon !== addonId));

    addon._load();
  }

  disable (addonId) {
    const addon = this.get(addonId);

    if (!addon) {
      console.log(addonId);
      console.log(addon);
      throw new Error(`Tried to disable a non-installed ${toSingular(this._type)}: (${addonId})`);
    }

    if (this._type !== 'themes' && !addon._ready) {
      return this.error(`Tried to unload a non-loaded ${toSingular(this._type)}: (${addon})`);
    }

    vizality.settings.set(`disabled${toTitleCase(this._type)}`, [ ...vizality.settings.get(`disabled${toTitleCase(this._type)}`, []), addonId ]);

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
    if (this.isInternal(addonId)) {
      throw new Error(`You cannot uninstall an internal ${toSingular(this._type)}. (Tried to uninstall: ${addonId})`);
    }

    await this.unmount(addonId);
    await removeDirRecursive(resolve(this._dir, addonId));
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

  log (...data) { log(_module, this._type, null, ...data); }
  warn (...data) { warn(_module, this._type, null, ...data); }
  error (...data) { error(_module, this._type, null, ...data); }
};
