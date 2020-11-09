const { remote: { globalShortcut } } = require('electron');
const { join } = require('path');

const { Directories } = require('@vizality/constants');
const { API } = require('@vizality/entities');

const localShortcut = require(join(Directories.MODULES, '.keybindutils', 'localShortcut'));

/* @todo: Convert errors to logger. */

/**
 * @typedef VizalityKeybind
 * @property {string} keybind Keybind accelerator
 * @property {Function} executor Executor
 * @property {boolean} isGlobal Whether the keybind should be usable when Discord is not focused or not
 * @see https://github.com/electron/electron/blob/master/docs/api/accelerator.md
 */

/**
 * Vizality Keybinds API
 * @property {object<string, VizalityKeybind>} keybinds Keybinds
 */
module.exports = class KeybindsAPI extends API {
  constructor () {
    super();
    this.keybinds = {};
  }

  /**
   * Registers a keybind
   * @param {string} id Keybind ID
   * @param {VizalityKeybind} keybind Keybind
   */
  registerKeybind (id, keybind) {
    if (this.keybinds[id]) {
      throw new Error(`Keybind ${id} is already registered!`);
    }
    this.keybinds[id] = keybind;
    this._register(keybind);
  }

  /**
   * Changes a keybind
   * @param {string} id Keybind ID to update
   * @param {string} newBind New keybind to bind
   */
  changeBind (id, newBind) {
    if (!this.keybinds[id]) {
      throw new Error(`Keybind ${id} is not registered!`);
    }

    this._unregister(this.keybinds[id]);
    this.keybinds[id].keybind = newBind;
    this._register(this.keybinds[id]);
  }

  /**
   * Unregisters a keybind
   * @param {string} id Keybind to unregister
   */
  unregisterKeybind (id) {
    if (this.keybinds[id]) {
      this._unregister(this.keybinds[id]);
      delete this.keybinds[id];
    }
  }

  /** @private */
  _register (keybind) {
    try {
      if (keybind.isGlobal) {
        globalShortcut.register(keybind.keybind, keybind.executor);
      } else {
        localShortcut.register(keybind.keybind, keybind.executor);
      }
    } catch (err) {
      this.error('Failed to register keybind!', err);
    }
  }

  /** @private */
  _unregister (keybind) {
    try {
      if (keybind.isGlobal) {
        globalShortcut.unregister(keybind.keybind);
      } else {
        localShortcut.unregister(keybind.keybind);
      }
    } catch (err) {
      // Let it fail silently; probably just an invalid/unset keybind.
    }
  }
};
