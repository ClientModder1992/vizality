import fs, { readdirSync, existsSync, lstatSync } from 'fs';
import { resolve } from 'path';
import { join } from 'path';
import { clone } from 'isomorphic-git';
import http from 'isomorphic-git/http/node';

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
    // Skip the .exists file
    if (addonId === '.exists') return;
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

      this._setIcon(addonId, manifest);

      this.items.set(addonId, new AddonClass());
    } catch (err) {
      return this._error(`An error occurred while initializing "${addonId}"!`, err);
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
      return this._error(`An error occurred while unmounting "${addonId}"!`, err);
    }
  }

  async remount (addonId, showLogs = true) {
    try {
      await this.unmount(addonId, showLogs);
    } catch (err) {
      return this._error(`An error occurred while remounting "${addonId}"!`, err);
    }
    /*
     * @note I have these separated like this because it seems to cause problems if they're
     * not separated for some reason. Not confirmed yet though.
     */
    try {
      await this.mount(addonId);
      await this.get(addonId)?._load(showLogs);
    } catch (err) {
      return this._error(`An error occurred while remounting "${addonId}"!`, err);
    }
  }

  async remountAll () {
    try {
      const addons = this.getEnabledKeys();
      for (const addon of addons) {
        await this.remount(addon, false);
      }
    } catch (err) {
      return this._error(`An error occurred while remounting all ${this.type}!`, err);
    }
    return this._log(`All ${this.type} have been re-initialized!`);
  }

  async initialize () {
    let addonId;
    try {
      const files = readdirSync(this.dir).sort(this._sortAddons);
      for (const filename of files) {
        addonId = filename;

        if (lstatSync(join(this.dir, addonId)).isFile() && addonId !== '.exists') {
          continue;
        }

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
      return this._error(`An error occurred while initializing "${addonId}"!`, err);
    }
  }

  async terminate () {
    try {
      const addons = this.keys;
      for (const addon of addons) {
        if (this.isEnabled(addon)) {
          await this.unmount(addon, false);
        } else {
          Object.keys(require.cache).forEach(key => {
            if (key.includes(addon)) {
              delete require.cache[key];
            }
          });
          this.items.delete(addon);
        }
      }
    } catch (err) {
      return this._error(`There was a problem shutting down ${this.type}!`, err);
    }
    return this._log(`All ${this.type} have been unloaded!`);
  }

  async enable (addonId) {
    try {
      const addon = this.get(addonId);

      if (!addon) {
        throw new Error(`Tried to enable a non-installed ${toSingular(this.type)}: "${addonId}"!`);
      }

      if ((this.type === 'plugins' || this.type === 'builtins') && addon._ready) {
        throw new Error(`Tried to enable an already-loaded ${toSingular(this.type)}: "${addonId}"!`);
      }

      vizality.settings.set(`disabled${toTitleCase(this.type)}`,
        vizality.settings.get(`disabled${toTitleCase(this.type)}`, [])
          .filter(addon => addon !== addonId));

      await addon._load('enabled');
    } catch (err) {
      return this._error(err);
    }
  }

  async disable (addonId) {
    try {
      const addon = this.get(addonId);
      if (!addon) {
        throw new Error(`Tried to disable a non-installed ${toSingular(this.type)}: "${addonId}"!`);
      }

      if ((this.type !== 'themes') && !addon._ready) {
        throw new Error(`Tried to disable a non-loaded ${toSingular(this.type)}: "${addon}"!`);
      }

      vizality.settings.set(`disabled${toTitleCase(this.type)}`, [
        ...vizality.settings.get(`disabled${toTitleCase(this.type)}`, []),
        addonId
      ]);

      await addon._unload('disabled');
    } catch (err) {
      return this._error(err);
    }
  }

  /**
   * Reloads an plugin or theme.
   * @param {string} addonId Addon ID
   */
  async reload (addonId) {
    try {
      await this.disable(addonId);
      await this.enable(addonId);
    } catch (err) {
      return this._error(err);
    }
  }

  /**
   * Reloads all plugins or themes.
   */
  async reloadAll () {
    try {
      const addons = this.getEnabled();
      for (const addon of addons) {
        await this.reload(addon);
      }
    } catch (err) {
      return this._error(err);
    }
  }

  async enableAll () {
    try {
      const addons = this.getDisabledKeys();
      for (const addon of addons) {
        await this.enable(addon);
      }
    } catch (err) {
      return this._error(err);
    }
  }

  async disableAll () {
    try {
      const addons = this.getEnabledKeys();
      for (const addon of addons) {
        await this.disable(addon);
      }
    } catch (err) {
      return this._error(err);
    }
  }

  async install (url) {
    try {
      /**
       * This is temporary until we get the API working to request this info from an endpoint.
       */
      const community = [ 'spotify-in-discord', 'copy-raw-message', 'better-code-blocks', 'status-everywhere', 'open-links-in-discord', 'example-plugin-settings', 'channel-members-activity-icons', 'bring-back-gamer-text', 'heyzere' ];

      let addonId;
      for (const addon of community) {
        if (url === addon) {
          addonId = addon;
          break;
        }
      }

      if (!addonId) {
        if (!new RegExp(/^(((https?:\/\/)(((([a-zA-Z0-9][a-zA-Z0-9\-_]{1,252})\.){1,8}[a-zA-Z]{2,63})\/))|((ssh:\/\/)?git@)(((([a-zA-Z0-9][a-zA-Z0-9\-_]{1,252})\.){1,8}[a-zA-Z]{2,63})(:)))([a-zA-Z0-9][a-zA-Z0-9_-]{1,36})(\/)([a-zA-Z0-9][a-zA-Z0-9_-]{1,36})((\.git)?)$/).test(url)) {
          throw new Error('You must provide a valid GitHub repository URL or an addon ID from https://github.com/vizality-community!');
        }
      }

      // The URL must end in git to get processed by isomorphic-git below
      if (!url.endsWith('.git')) {
        url = `${url}.git`;
      }

      addonId = addonId || url.split('.git')[0].split('/')[url.split('.git')[0].split('/').length - 1];

      if (this.isInstalled(addonId)) {
        throw new Error(`${toSingular(toTitleCase(this.type))} "${addonId}" is already installed!`);
      }

      if (existsSync(join(this.dir, addonId)) && lstatSync(join(this.dir, addonId)).isDirectory()) {
        throw new Error(`${toSingular(toTitleCase(this.type))} directory "${addonId}" already exists!`);
      }

      try {
        await clone({
          fs,
          http,
          singleBranch: true,
          depth: 1,
          dir: join(this.dir, addonId),
          url
        });
      } catch (err) {
        /*
         * isomorphic-git creates the directory before it checks anything, whether there is
         * a response or not, so let's remove it if there's an error here.
         */
        await removeDirRecursive(resolve(this.dir, addonId));
        return this._error(err);
      }

      this._log(`${toSingular(toTitleCase(this.type))} "${addonId}" has been installed!`);
      await this.mount(addonId);
      await this.get(addonId)._load(false);
    } catch (err) {
      return this._error(err);
    }
  }


  _sortAddons (addonA, addonB) {
    const priority = [ 'vz-privacy', 'vz-router', 'vz-commands', 'vz-dashboard', 'vz-addon-manager', 'vz-attributes', 'vz-notices', 'vz-rpc', 'vz-quick-code', 'vz-enhancements', 'vz-settings', 'vz-updater' ].reverse();
    const priorityA = priority.indexOf(addonA);
    const priorityB = priority.indexOf(addonB);
    return (priorityA === priorityB ? 0 : (priorityA < priorityB ? 1 : -1));
  }

  /**
   * Uninstalls a plugin or theme.
   * @param {string} addonId Addon ID
   * @private
   */
  async _uninstall (addonId) {
    try {
      await this.unmount(addonId);
      await removeDirRecursive(resolve(this.dir, addonId));
      return this._log(`${toTitleCase(toSingular(this.type))} "${addonId}" has been uninstalled!`);
    } catch (err) {
      return this._error(err);
    }
  }

  /**
   * Sets a plugin or theme's icon image URL.
   * @param {string} addonId Addon ID
   * @param {object} manifest Addon manifest
   * @private
   */
  async _setIcon (addonId, manifest) {
    if (manifest.icon) {
      return manifest.icon = `vz-${toSingular(this.type)}://${addonId}/${manifest.icon}`;
    }

    const validExtensions = [ '.png', '.svg', '.jpg', '.jpeg', '.webp' ];

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

  /** @private */
  _log (...data) { log({ module: this._module, submodule: this._submodule }, ...data); }
  _warn (...data) { warn({ module: this._module, submodule: this._submodule }, ...data); }
  _error (...data) { error({ module: this._module, submodule: this._submodule }, ...data); }
}
