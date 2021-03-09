import fs, { readdirSync, existsSync, lstatSync, renameSync, stat, readFileSync } from 'fs';
import http from 'isomorphic-git/http/node';
import { join, resolve, sep } from 'path';
import { clone } from 'isomorphic-git';
import { watch } from 'chokidar';
import Events from 'events';

import { toSingular, toTitleCase, toHash, toKebabCase } from '@vizality/util/string';
import { log, warn, error } from '@vizality/util/logger';
import { removeDirRecursive } from '@vizality/util/file';
import { Avatars } from '@vizality/constants';

const requiredManifestKeys = [ 'name', 'version', 'description', 'author' ];

/**
 * 
 */
export default class AddonManager extends Events {
  constructor (type, dir) {
    super();
    this.dir = dir;
    this.type = type;
    this.items = new Map();
    this._watcherEnabled = null;
    this._watcher = {};
    this._labels = [ 'Manager', toSingular(this.type) ];
  }

  /**
   * 
   */
  get count () {
    return this.items.size;
  }

  /**
   * 
   */
  get values () {
    return this.items.values();
  }

  /**
   * 
   * @param {*} addonId 
   * @returns 
   */
  get keys () {
    return [ ...this.items.keys() ];
  }

  /**
   * 
   * @param {*} addonId 
   * @returns 
   */
  has (addonId) {
    return this.items.has(addonId);
  }

  /**
   * 
   * @param {*} addonId 
   * @returns 
   */
  get (addonId) {
    return this.items.get(addonId);
  }

/**
 * 
 * @param {*} addonId 
 * @returns 
 */
  getAll () {
    return this.items;
  }

/**
 * 
 * @param {*} addonId 
 * @returns 
 */
  isInstalled (addonId) {
    return this.has(addonId);
  }

/**
 * 
 * @param {*} addonId 
 * @returns 
 */
  isEnabled (addonId) {
    return !vizality.settings.get(`disabled${toTitleCase(this.type)}`, [])
      .filter(addon => this.isInstalled(addon))
      .includes(addonId);
  }

  /**
   * 
   * @param {*} addonId 
   * @returns 
   */
  isDisabled (addonId) {
    return !this.isEnabled(addonId);
  }

  /**
   * 
   * @param {*} addonId 
   * @returns 
   */
  hasSettings (addonId) {
    try {
      const addon = this.get(addonId);
      if (!addon) throw new Error(`${toSingular(toTitleCase(this.type))} "${addonId}" is not installed!`);
      return Boolean(addon.sections?.settings);
    } catch (err) {
      return this.error(`An error occurred while checking for settings for "${addonId}"!`, err);
    }
  }

  /**
   * 
   * @returns 
   */
  getEnabledKeys () {
    const addons = this.keys;
    return addons.filter(addon => this.isEnabled(addon));
  }

  /**
   * 
   * @returns 
   */
  getEnabled () {
    const enabled = new Map();
    this.getEnabledKeys()
      .sort((a, b) => a - b)
      .map(addon => this.get(addon))
      .forEach(addon => enabled.set(addon.addonId, addon));

    return enabled;
  }

  /**
   * 
   * @returns 
   */
  getDisabledKeys () {
    const addons = this.keys;
    return addons.filter(addon => this.isDisabled(addon));
  }

  /**
   * 
   * @returns 
   */
  getDisabled () {
    const disabled = new Map();
    this.getDisabledKeys()
      .sort((a, b) => a - b)
      .map(addon => this.get(addon))
      .forEach(addon => disabled.set(addon.addonId, addon));

    return disabled;
  }

  /**
   * 
   * @param {*} addonId 
   * @returns 
   */
  async mount (addonId) {
    let manifest;
    try {
      manifest = Object.assign({
        appMode: 'app'
      }, await import(resolve(this.dir, addonId, 'manifest.json')));
    } catch (err) {
      return this._error(`${toSingular(toTitleCase(this.type))} "${addonId}" doesn't have a valid manifest. Initialization aborted.`);
    }

    if (!requiredManifestKeys.every(key => manifest.hasOwnProperty(key))) {
      return this._error(`${toSingular(toTitleCase(this.type))} "${addonId}" doesn't have a valid manifest. Initialization aborted.`);
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

      this._setAddonIcon(addonId, manifest);

      this.items.set(addonId, new AddonClass());
    } catch (err) {
      return this._error(`An error occurred while initializing "${addonId}"!`, err);
    }
  }

  /**
   * 
   * @param {*} addonId 
   * @param {*} showLogs 
   * @returns 
   */
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

  /**
   * 
   * @param {*} addonId 
   * @param {*} showLogs 
   * @returns 
   */
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

  /**
   * 
   * @returns 
   */
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

  /**
   * 
   * @returns 
   */
  async initialize () {
    let addonId;
    const ignorePath = join(this.dir, '.vzignore');
    const ignore = existsSync(ignorePath) ? readFileSync(ignorePath, 'utf-8').split('\n').map(e => e.trim()) : [];
    try {
      await this._enableWatcher();
      if (this._watcherEnabled) {
        await this._watchFiles();
      }
      const files = readdirSync(this.dir).sort(this._sortBuiltins);

      for (const filename of files) {
        addonId = filename;

        if ((lstatSync(join(this.dir, addonId)).isFile() && addonId !== '.exists') || ignore.indexOf(addonId) > -1) {
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

  /**
   * 
   * @returns 
   */
  async stop () {
    try {
      this._disableWatcher();
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

  /**
   * 
   * @param {*} addonId 
   * @returns 
   */
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

  /**
   * 
   * @param {*} addonId 
   * @returns 
   */
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

  /**
   * 
   * @returns 
   */
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

  /**
   * 
   * @returns 
   */
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

  /**
   * 
   * @param {*} addons 
   * @returns 
   */
  async install (addons) {
    try {
      /**
       * This is temporary until we get the API working to request this info from an endpoint.
       */
      const community = [ 'spotify-in-discord', 'copy-raw-message', 'better-code-blocks', 'status-everywhere', 'open-links-in-discord', 'example-plugin-settings', 'channel-members-activity-icons', 'bring-back-gamer-text', 'heyzere' ];
      addons = [ addons ].flat();
      for (let addon of addons) {
        let addonId;
        for (const _addon of community) {
          if (addon === _addon) {
            addonId = _addon;
            break;
          }
        }

        if (!addonId) {
          if (!new RegExp(/^(((https?:\/\/)(((([a-zA-Z0-9][a-zA-Z0-9\-_]{1,252})\.){1,8}[a-zA-Z]{2,63})\/))|((ssh:\/\/)?git@)(((([a-zA-Z0-9][a-zA-Z0-9\-_]{1,252})\.){1,8}[a-zA-Z]{2,63})(:)))([a-zA-Z0-9][a-zA-Z0-9_-]{1,36})(\/)([a-zA-Z0-9][a-zA-Z0-9_-]{1,36})((\.git)?)$/).test(addon)) {
            throw new Error('You must provide a valid GitHub repository URL or an addon ID from https://github.com/vizality-community!');
          }
        }

        // The URL must end in git to get processed by isomorphic-git below
        if (!addon.endsWith('.git')) {
          addon = `${addon}.git`;
        }

        addonId = addonId || addon.split('.git')[0].split('/')[addon.split('.git')[0].split('/').length - 1];
        addonId = toKebabCase(addonId);

        if (this.isInstalled(addonId)) {
          throw new Error(`${toSingular(toTitleCase(this.type))} "${addonId}" is already installed!`);
        }

        if (existsSync(join(this.dir, `__installing__${addonId}`)) && lstatSync(join(this.dir, addonId)).isDirectory()) {
          throw new Error(`${toSingular(toTitleCase(this.type))} "${addonId}" looks like it's already being installed!`);
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
            dir: join(this.dir, `__installing__${addonId}`),
            url: addon,
            onProgress: evt => {
              // console.log(evt);
            }
          });
        } catch (err) {
          /*
           * isomorphic-git creates the directory before it checks anything, whether there is
           * a response or not, so let's remove it if there's an error here.
           */
          await removeDirRecursive(resolve(this.dir, addonId));
          throw new Error(`There was a problem while attempting to install "${addonId}"!`, err);
        }

        renameSync(join(this.dir, `__installing__${addonId}`), join(this.dir, addonId));
      }
    } catch (err) {
      return this._error(err);
    }
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
    } catch (err) {
      return this._error(err);
    }
  }

  /**
   * Sets a plugin or theme's icon image URL.
   * @param {string} addonId Addon ID
   * @param {Object} manifest Addon manifest
   * @private
   */
  async _setAddonIcon (addonId, manifest) {
    try {
      if (manifest.icon) {
        if (!manifest.icon.endsWith('.png') && !manifest.icon.endsWith('.jpg') && !manifest.icon.endsWith('.jpeg')) {
          this._warn(`${toTitleCase(toSingular(this.type))} icon must be of type .png, .jpg, or .jpeg.`);
        } else {
          return manifest.icon = `vz-${toSingular(this.type)}://${addonId}/${manifest.icon}`;
        }
      }

      const validExtensions = [ '.png', '.jpg', '.jpeg' ];

      if (validExtensions.some(ext => existsSync(resolve(this.dir, addonId, 'assets', `icon${ext}`)))) {
        for (const ext of validExtensions) {
          if (existsSync(resolve(this.dir, addonId, 'assets', `icon${ext}`))) {
            manifest.icon = `vz-${toSingular(this.type)}://${addonId}/assets/icon${ext}`;
            break;
          }
        }
      } else {
        const addonIdHash = toHash(addonId);
        return manifest.icon = Avatars[`DEFAULT_${toSingular(this.type.toUpperCase())}_${(addonIdHash % 5) + 1}`];
      }
    } catch (err) {
      return this._error(err);
    }
  }

  /**
   * Enables the addon directory watcher.
   * @private
   */
  async _enableWatcher () {
    this._watcherEnabled = true;
  }

  /**
   * Disables the addon directory watcher.
   * @private
   */
  async _disableWatcher () {
    this._watcherEnabled = false;
    if (this._watcher?.close) {
      await this._watcher.close();
      this._watcher = {};
    }
  }

  /**
   * Initiates the addon directory watcher.
   * @private
   */
  async _watchFiles () {
    this._watcher = watch(this.dir, {
      ignored: [ /.exists/, /__installing__/ ],
      ignoreInitial: true,
      depth: 0
    });

    /**
     * Makes sure that the directory added has been completely copied by the operating
     * system before it attempts to do anything with the addon.
     * @see {@link https://memorytin.com/2015/07/08/node-js-chokidar-wait-for-file-copy-to-complete-before-modifying/}
     * @param {string} path Addon folder path
     * @param {Object} prev Previous folder stats info @see {@link https://nodejs.org/api/fs.html#fs_class_fs_stats}
     * @private
     */
    const checkAddDirComplete = (path, prev) => {
      try {
        stat(path, async (err, stat) => {
          if (err) {
            throw err;
          }
          if (stat.mtime.getTime() === prev.mtime.getTime()) {
            const addonId = path.replace(this.dir + sep, '');
            if (addonId !== toKebabCase(addonId)) {
              renameSync(path, join(this.dir, toKebabCase(addonId)));
            }
            await this.mount(addonId);
            await this.get(addonId)?._load();
          } else {
            setTimeout(checkAddDirComplete, 2000, path, stat);
          }
        });
      } catch (err) {
        this._error(err);
      }
    };

    this._watcher
      .on('addDir', (path, stat) => {
        setTimeout(checkAddDirComplete, 2000, path, stat);
      })
      .on('unlinkDir', path => {
        const addonId = path.replace(this.dir + sep, '');
        Object.keys(require.cache).forEach(key => {
          if (key.includes(addonId)) {
            delete require.cache[key];
          }
        });
        this.items.delete(addonId);
      });
  }

  /** @private */
  _log (...message) { log({ labels: this._labels, message }); }
  _warn (...message) { warn({ labels: this._labels, message }); }
  _error (...message) { error({ labels: this._labels, message }); }
}
