const { string: { toPlural, toHeaderCase }, fil: { removeDirRecursive } } = require('@utilities');

const ErrorTypes = {
  NOT_A_DIRECTORY: 'NOT A DIRECTOR',
  MANIFEST_LOAD_FAILED: 'MANIFEST_LOAD_FAILED',
  INVALID_MANIFEST: 'INVALID_MANIFEST',
  ENABLE_NON_INSTALLED: 'ENABLE_NON_INSTALLED',
  ENABLE_ALREADY_ENABLED: 'ENABLE_ALREADY_ENABLED',
  DISABLE_NON_INSTALLED: 'DISABLE_NON_INSTALLED',
  DISABLE_NON_ENABLED: 'DISABLE_NON_ENABLED'
};

class AddonManager {
  constructor (type, dir) {
    this.type = `${toPlural(this.type)}`;
    this.dir = dir;
    this.plugins = new Map();
  }

  get _getRequiredManifestKeys () {
    return [ 'name', 'version', 'description', 'author' ];
  }

  get (addonId) {
    return this[this.type].get(addonId);
  }

  getAll () {
    return [ ...this[this.type].keys() ];
  }

  isInstalled (addonId) {
    console.log(addonId);
    // return this[this.type].has(addonId);
    return this.plugins.has(addonId);
  }

  isEnabled (addonId) {
    return !vizality.settings.get(`disabled${toHeaderCase(type)}`, []).includes(addon);
  }

  isCore (addonId) {

  }

  isBundled (addonId) {

  }

  enable (addonId) {
    const addon = this.get(addonId);
  
    if (!addon) {
      throw new Error(`Tried to enable a non-installed plugin: (${addonId})`);
    }
  
    if (addon.ready) {
      return this.error(`Tried to enable an already-loaded plugin: (${addon})`);
    }
  
    vizality.settings.set(
      `disabled${toHeaderCase(type)}`,
      vizality.settings.get(`disabled${toHeaderCase(type)}`, []).filter(p => p !== addonId)
    );
  
    addon._load();
  }
  
  disable (addonId) {
    const addon = this.get(addonId);
  
    if (!addon) {
      throw new Error(`Tried to disable a non-installed plugin: (${pluginID})`);
    }
  
    if (addon.ready) {
      return this.error(`Tried to disable a non-loaded plugin: (${plugin})`);
    }
  
    vizality.settings.set(
      `disabled${toHeaderCase(type)}`,
      [ ...vizality.settings.get(`disabled${toHeaderCase(type)}`, []), addonId ]
    );
  
    addon._unload();
  }

  async install (addonId) {
    throw new Error('no');
  }

  async uninstall (addonId) {
    if (addonId.startsWith('vz-')) {
      throw new Error(`You cannot uninstall an internal plugin. (Tried to uninstall: ${addonId})`);
    }

    await this.unmount(addonId);
    await removeDirRecursive(resolve(this.dir, addonId));
  }

  async unmount (addonId) {
    const addon = this.get(addonId);
    
    if (!addon) {
      throw new Error(`Tried to unmount a non installed plugin (${addon})`);
    }

    if (addon.ready) {
      await addon._unload();
    }

    Object.keys(require.cache).forEach(key => {
      if (key.includes(addonId)) {
        delete require.cache[key];
      }
    });

    this[this.type].delete(addonId);
  }

  _validateManifest (manifest) {
    const errors = [];
    if (typeof manifest.name !== 'string') {
      errors.push(`Invalid name: expected a string got ${typeof manifest.name}`);
    }
    if (typeof manifest.description !== 'string') {
      errors.push(`Invalid description: expected a string got ${typeof manifest.description}`);
    }
    if (typeof manifest.version !== 'string') {
      errors.push(`Invalid version: expected a string got ${typeof manifest.version}`);
    }
    if (typeof manifest.author !== 'string') {
      errors.push(`Invalid author: expected a string got ${typeof manifest.author}`);
    }
  }

  log (...data) {

  }

  warn (...data) {

  }

  error (...data) {

  }
}

module.exports = AddonManager;
