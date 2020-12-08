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
 * @property {object} options Keybind options
 * @property {boolean} options.blurred
 * @property {boolean} options.focused
 * @property {boolean} options.keydown
 * @property {boolean} options.keyup
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
        blurred: true,
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
    switch (key) {
      case 'mod': {
        switch (os) {
          case 'win32': return 162;
          case 'linux': return 666;
          case 'darwin': return 666;
        }
        break;
      }
      case 'ctrl': {
        switch (os) {
          case 'win32': return 162;
          case 'linux': return 666;
          case 'darwin': return 666;
        }
        break;
      }
      case 'rctrl': {
        switch (os) {
          case 'win32': return 163;
          case 'linux': return 666;
          case 'darwin': return 666;
        }
        break;
      }
      case 'alt': {
        switch (os) {
          case 'win32': return 164;
          case 'linux': return 666;
          case 'darwin': return 666;
        }
        break;
      }
      case 'ralt': {
        switch (os) {
          case 'win32': return 165;
          case 'linux': return 666;
          case 'darwin': return 666;
        }
        break;
      }
      case 'shift': {
        switch (os) {
          case 'win32': return 160;
          case 'linux': return 666;
          case 'darwin': return 666;
        }
        break;
      }
      case 'rshift': {
        switch (os) {
          case 'win32': return 161;
          case 'linux': return 666;
          case 'darwin': return 666;
        }
        break;
      }
    }
  }

  /** @private */
  _shortcutToKeyCode (shortcut) {
    /** @see {@link https://github.com/ianstormtaylor/is-hotkey} **/
    const { toKeyCode } = getModule('toKeyCode');
    const keys = [];
    const modifiers = [ 'mod', 'ctrl', 'rctrl', 'alt', 'ralt', 'shift', 'rshift' ];
    const shortcuts = shortcut.split('+');
    shortcuts.forEach(s => {
      if (modifiers.includes(s)) {
        s = this._getVirtualKeyCode(s);
      } else {
        s = toKeyCode(s);
      }
      keys.push([ 0, s ]);
    });

    return keys;
  }
};
