import { existsSync } from 'fs';
import { join } from 'path';
import { Directories } from '@vizality/constants';

import Theme from '../entities/Theme';
import AddonManager from './Addon';
import manifestEntries from './theme_manifest.json';

const fileRegex = /\.((s?c)ss)$/;
const typeOf = what => Array.isArray(what)
  ? 'array'
  : what === null
    ? 'null'
    : typeof what;
const listFormat = new Intl.ListFormat('en', { type: 'disjunction' });

export default class ThemeManager extends AddonManager {
  constructor (type, dir) {
    type = 'themes';
    dir = Directories.THEMES;
    super(type, dir);
  }

  async mount (addonId) {
    // Skip the .exists file
    if (addonId === '.exists') return;
    const manifestFile = join(this.dir, addonId, 'manifest.json');

    if (!existsSync(manifestFile)) {
      return this._error(`no manifest found`);
    }

    let manifest;
    try {
      manifest = await import(manifestFile);
    } catch (err) {
      return this._error('Failed to load manifest');
    }

    const errors = this._validateManifest(manifest);
    if (errors.length > 0) {
      return this._error(`Invalid manifest; Detected the following errors:\n\t${errors.join('\n\t')}`);
    }

    if (window.__SPLASH__ && manifest.splashTheme) {
      manifest.effectiveTheme = manifest.splashTheme;
    } else if (window.__OVERLAY__ && manifest.overlayTheme) {
      manifest.effectiveTheme = manifest.overlayTheme;
    } else if (!window.__OVERLAY__ && !window.__SPLASH__ && manifest.theme) {
      manifest.effectiveTheme = manifest.theme;
    } else {
      return this._warn(`Theme "${addonId}" is not meant to run on that environment - Skipping`);
    }

    manifest.effectiveTheme = join(this.dir, addonId, manifest.effectiveTheme);
    this._setIcon(addonId, manifest);
    this.items.set(addonId, new Theme(addonId, manifest));
  }

  _validateOverlayTheme () { return []; }
  _validatePlugins () { return []; }

  _validateManifest (manifest) {
    const errors = [];

    for (const entry of manifestEntries) {
      const isValid = entry.types.some(type => typeOf(manifest[entry.prop]) === type);
      if (!isValid && entry.type === 'required') {
        errors.push(`Invalid ${entry.prop}: expexted a ${entry.types.length > 1 ? listFormat.format(entry.types) : entry.types[0]} but got ${typeOf(manifest[entry.prop])} instead.`);
      } else if (entry.validate) {
        const errorsFound = this[entry.validate](manifest);
        if (errorsFound.length && entry.type === 'required') {
          errors.push(...errorsFound);
        }
      }
    }
    return errors;
  }

  _validateFileExtension (manifest) {
    if (typeof manifest.theme !== 'string') return [ `Invalid theme: expected a string but got ${typeOf(manifest.theme)}` ];
    const matches = fileRegex.test(manifest.theme);
    if (!matches) return [ 'Invalid theme: unsupported file extension' ];
    return [];
  }

  _validateSettings ({ settings }) {
    if (!Array.isArray(settings)) return [ `Invalid settings: expected an array got ${typeof settings}` ];
    const errors = [];

    for (const setting of settings) {
      const currentIndex = settings.indexOf(setting);
      if (typeof setting.type === 'undefined') errors.push(`Invalid settings: Setting at position ${currentIndex}; property "type" was not found.`);
      if ([ 'divider', 'category' ].indexOf(setting.type) > -1) continue;
      if (typeof setting !== 'object') errors.push(`Invalid settings: Setting at position ${currentIndex}; expected a object but got ${typeOf(setting)}`);
      if (typeof setting.id !== 'string') errors.push(`Invalid settings: Setting at position ${currentIndex}; property "id" expected a string but got ${typeOf(setting.id)}`);
      if (typeof setting.defaultValue === 'undefined') errors.push(`Invalid settings: Setting at position ${currentIndex}; property "defaultValue" expected a string but got ${typeOf(setting.defaultValue)}`);
    }

    return errors;
  }
}
