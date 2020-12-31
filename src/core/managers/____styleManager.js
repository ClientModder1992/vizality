/* @todo: Use logger. */
const { dom: { createElement }, logger: { error, log, warn } } = require('@vizality/util');
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

class StyleManager {
  constructor () {
    this.themesDir = Directories.THEMES;
    this.themes = new Map();

    if (!window.__SPLASH__) {
      /**
       * Injects a style element containing the styles from the specified stylesheet into the
       * document head. Style element (and styles) are automatically removed on
       * plugin disable/unload.
       * @returns {void}
       */
      const injectStyles = () => {
        const path = '../styles/main.scss';

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

  get disabledThemes () {
    if (window.__SPLASH__) {
      if (!this.__settings) {
        this.__settings = {};
        try {
          this.__settings = require(join(Directories.SETTINGS, 'settings.json'));
        } catch (err) {
          // @todo: Handled this.
        }

        return this.__settings.disabledThemes || [];
      }
    }
    return vizality.settings.get('disabledThemes', []);
  }

  // Getters
  get (themeID) {
    return this.themes.get(themeID);
  }

  getThemes () {
    return [ ...this.themes.keys() ];
  }

  isInstalled (theme) {
    return this.themes.has(theme);
  }

  isEnabled (theme) {
    return !this.disabledThemes.includes(theme);
  }

  enable (themeID) {
    if (!this.get(themeID)) {
      throw new Error(`Tried to enable a non installed theme (${themeID})`);
    }

    vizality.settings.set('disabledThemes', this.disabledThemes.filter(p => p !== themeID));
    this.themes.get(themeID)._load();
  }

  disable (themeID) {
    const plugin = this.get(themeID);
    if (!plugin) {
      throw new Error(`Tried to disable a non installed theme (${themeID})`);
    }

    vizality.settings.set('disabledThemes', [ ...this.disabledThemes, themeID ]);
    this.themes.get(themeID)._unload();
  }

  /*
   * --------------
   * VALIDATOR HELL
   * --------------
   */

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
}

module.exports = StyleManager;
