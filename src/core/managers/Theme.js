import { existsSync } from 'fs';
import { join } from 'path';

import { Directories } from '@vizality/constants';

import Theme from '../entities/Theme';
import AddonManager from './Addon';

const fileRegex = /\.((s?c)ss)$/;

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
      return this._error(`Invalid manifest. Detected the following errors:\n\t${errors.join('\n\t')}`);
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

  _validateManifest (manifest) {
    try {
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
      if (typeof manifest.theme !== 'string') {
        errors.push(`Invalid theme: expected a string got ${typeof manifest.theme}`);
      } else if (!fileRegex.test(manifest.theme)) {
        errors.push('Invalid theme: unsupported file extension');
      }
      if (manifest.overlayTheme) {
        if (typeof manifest.overlayTheme !== 'string') {
          errors.push(`Invalid theme: expected a string got ${typeof manifest.overlayTheme}`);
        } else if (!fileRegex.test(manifest.overlayTheme)) {
          errors.push('Invalid theme: unsupported file extension');
        }
      }
      if (![ 'undefined', 'string' ].includes(typeof manifest.discord)) {
        errors.push(`Invalid discord code: expected a string got ${typeof manifest.discord}`);
      }
      return errors;
    } catch (err) {
      return this._error(err);
    }
  }
}
