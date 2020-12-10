/* @todo: Use logger. */
const { dom: { createElement } } = require('@vizality/util');
const { resolveCompiler } = require('@vizality/compilers');
const { Directories } = require('@vizality/constants');
const { Theme } = require('@vizality/entities');

const { join } = require('path');
const { promises: { lstat }, readdirSync, existsSync } = require('fs');

const fileRegex = /\.((s?c)ss)$/;

const ErrorTypes = Object.freeze({
  NOT_A_DIRECTORY: 'NOT_A_DIRECTORY',
  MANIFEST_LOAD_FAILED: 'MANIFEST_LOAD_FAILED',
  INVALID_MANIFEST: 'INVALID_MANIFEST'
});


const AddonManager = require('../../addon');

module.exports = class ThemeManager extends AddonManager {
  constructor (type, dir) {
    type = 'themes';
    dir = Directories.THEMES;

    super(type, dir);

    if (!window.__SPLASH__) {
      /**
       * Injects a style element containing the styles from the specified stylesheet into the
       * document head. Style element (and styles) are automatically removed on
       * plugin disable/unload.
       * @returns {void}
       */
      const injectStyles = () => {
        const path = '../../../styles/main.scss';

        // Assume it's a relative path and try resolving it
        const resolvedPath = join(__dirname, path);

        if (!existsSync(resolvedPath)) {
          throw new Error(`Cannot find '${path}'! Make sure the file exists and try again.`);
        }

        const id = Math.random().toString(36).slice(2);
        const compiler = resolveCompiler(resolvedPath);
        const style = createElement('style', {
          id: 'vizality-core-styles',
          'vz-style': ''
        });

        document.head.appendChild(style);
        const compile = async () => {
          style.innerHTML = await compiler.compile();
        };

        compiler.enableWatcher();
        compiler.on('src-update', compile);
        this[`__compileStylesheet_${id}`] = compile;
        this[`__compiler_${id}`] = compiler;
        return compile();
      };
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectStyles);
      } else {
        injectStyles();
      }
    }
  }

  async mount (themeID, filename) {
    const stat = await lstat(join(this.dir, filename));
    if (stat.isFile()) {
      this._logError(ErrorTypes.NOT_A_DIRECTORY, [ themeID ]);
      return;
    }

    const manifestFile = join(this.dir, filename, 'manifest.json');
    if (!existsSync(manifestFile)) {
      // Add an error here
      return;
    }

    let manifest;
    try {
      manifest = require(manifestFile);
    } catch (e) {
      this._logError(ErrorTypes.MANIFEST_LOAD_FAILED, [ themeID ]);
      console.error('%c[Vizality:StyleManager]', 'color: #7289da', 'Failed to load manifest', e);
      return;
    }

    const errors = this._validateManifest(manifest);
    if (errors.length > 0) {
      this._logError(ErrorTypes.INVALID_MANIFEST, [ themeID ]);
      console.error('%c[Vizality:StyleManager]', 'color: #7289da', `Invalid manifest; Detected the following errors:\n\t${errors.join('\n\t')}`);
      return;
    }

    if (window.__SPLASH__ && manifest.splashTheme) {
      manifest.effectiveTheme = manifest.splashTheme;
    } else if (window.__OVERLAY__ && manifest.overlayTheme) {
      manifest.effectiveTheme = manifest.overlayTheme;
    } else if (!window.__OVERLAY__ && !window.__SPLASH__ && manifest.theme) {
      manifest.effectiveTheme = manifest.theme;
    } else {
      return console.warn('%c[Vizality:StyleManager]', 'color: #7289da', `Theme "${themeID}" is not meant to run on that environment - Skipping`);
    }

    manifest.effectiveTheme = join(this.dir, filename, manifest.effectiveTheme);
    super._setIcon(manifest, themeID);
    this.themes.set(themeID, new Theme(themeID, manifest));
  }

  unmount (themeID) {
    const theme = this.themes.get(themeID);
    if (!theme) {
      throw new Error(`Tried to unmount a non installed theme (${themeID})`);
    }

    theme._unload();
    this.themes.delete(themeID);
  }


  // Start/Stop
  // async load (sync = false) {
  //   const missingThemes = [];
  //   const files = readdirSync(this.dir);
  //   for (const filename of files) {
  //     if (filename.startsWith('.')) {
  //       console.debug('%c[Vizality:StyleManager]', 'color: #7289da', 'Ignoring dotfile', filename);
  //       continue;
  //     }

  //     const addonId = filename.split('.').shift();
  //     if (!sync) {
  //       await this.mount(addonId, filename);

  //       // if theme didn't mounted
  //       if (!this[this.type].get(addonId)) {
  //         continue;
  //       }
  //     }

  //     if (!this.getAllDisabled().includes(addonId)) {
  //       if (sync && !this.isInstalled(addonId)) {
  //         await this.mount(addonId, filename);
  //         missingThemes.push(addonId);
  //       }

  //       this[this.type].get(addonId)._load();
  //     }
  //   }

  //   if (sync) {
  //     return missingThemes;
  //   }
  // }

  terminate () {
    return [ ...this.themes.values() ].forEach(t => t._unload());
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
    if (manifest.plugins !== void 0) {
      if (!Array.isArray(manifest.plugins)) {
        errors.push(`Invalid plugins: expected an array got ${typeof manifest.plugins}`);
      } else {
        manifest.plugins.forEach(p => errors.push(...this._validatePlugin(p)));
      }
    }
    if (manifest.settings !== void 0) {
      errors.push(...this._validateSettings(manifest.settings));
    }
    return errors;
  }
};
