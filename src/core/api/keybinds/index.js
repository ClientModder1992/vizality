const { logger: { error } } = require('@vizality/util');
const { getModule } = require('@vizality/webpack');
const { API } = require('@vizality/entities');

const _module = 'API';
const _submodule = 'Keybinds';

/**
 * @typedef VizalityKeybind
 * @property {string} id Keybind ID
 * @property {string} shortcut Keyboard shortcut
 * @property {Function} executor Executor action
 * @property {object} [options] Keybind options
 * @property {boolean} [options.blurred=false]
 * @property {boolean} [options.focused=true]
 * @property {boolean} [options.keydown=false]
 * @property {boolean} [options.keyup=true]
 */

/**
 * Vizality Keybinds API
 * @property {object<VizalityKeybind>} keybinds Keybinds
 */
module.exports = class KeybindsAPI extends API {
  constructor () {
    super();
    this.keybinds = {};
  }

  /**
   * Registers a keybind.
   * @param {VizalityKeybind} keybind Keybind
   */
  registerKeybind (keybind) {
    try {
      if (this.keybinds[keybind.id]) throw new Error(`Keybind "${keybind.id}" is already registered!`);

      keybind.eventId = Math.floor(100000 + Math.random() * 900000);
      keybind.options = keybind.options || {
        blurred: false,
        focused: true,
        keydown: false,
        keyup: true
      };

      this._register(keybind);
    } catch (err) {
      error(_module, `${_submodule}:registerKeybind`, null, err);
    }
  }

  /**
   * Unregisters a keybind.
   * @param {string} id ID of the keybind to unregister
   */
  unregisterKeybind (id) {
    try {
      if (!this.keybinds[id]) throw new Error(`Keybind "${id}" is not registered!`);

      this._unregister(this.keybinds[id]);
    } catch (err) {
      error(_module, `${_submodule}:unregisterKeybind`, null, err);
    }
  }

  /**
   * Changes a keybind.
   * @param {string} id ID of the keybind to unregister
   * @param {string} newShortcut New shortcut to bind
   */
  changeKeybindShortcut (id, newShortcut) {
    try {
      if (!this.keybinds[id]) throw new Error(`Keybind "${id}" is not registered!`);

      const keybind = this.keybinds[id];

      this._unregister(this.keybinds[id]);
      keybind.shortcut = newShortcut;
      this._register(keybind);
    } catch (err) {
      error(_module, `${_submodule}:changeKeybindShortcut`, null, err);
    }
  }

  /** @private */
  _register (keybind) {
    try {
      const discordUtils = DiscordNative.nativeModules.requireModule('discord_utils');

      discordUtils.inputEventRegister(keybind.eventId, this._shortcutToKeyCode(keybind.shortcut), keybind.executor, keybind.options);
      this.keybinds[keybind.id] = keybind;
    } catch (err) {
      error(_module, `${_submodule}:_register`, null, err);
    }
  }

  /** @private */
  _unregister (keybind) {
    try {
      const discordUtils = DiscordNative.nativeModules.requireModule('discord_utils');

      discordUtils.inputEventUnregister(keybind.eventId);
      delete this.keybinds[keybind.id];
    } catch (err) {
      error(_module, `${_submodule}:_unregister`, null, err);
    }
  }

  /** @private */
  _getVirtualKeyCode (key) {
    const os = DiscordNative.process.platform;
    const { keyToCode } = getModule('keyToCode');

    switch (key) {
      case 'rctrl': key = 'right ctrl'; break;
      case 'ralt': key = 'right ctrl'; break;
      case 'rshift': key = 'right ctrl'; break;
      case 'ctrl': if (os === 'linux') key = 'left ctrl'; break;
      case 'alt': if (os === 'linux') key = 'left ctrl'; break;
      case 'shift': if (os === 'linux') key = 'left ctrl'; break;
    }

    return keyToCode(key);
  }

  /** @private */
  _shortcutToKeyCode (shortcut) {
    /** @see {@link https://github.com/ianstormtaylor/is-hotkey} **/
    const keysHolder = [];
    const keys = shortcut.split('+');
    keys.forEach(key => {
      key = this._getVirtualKeyCode(key);
      keysHolder.push([ 0, key ]);
    });

    return keys;
  }
};
