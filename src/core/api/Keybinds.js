import { getModule } from '@vizality/webpack';
import { API } from '@vizality/entities';

/**
 * @typedef VizalityKeybind
 * @property {string} keybindId Keybind ID
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
export default class Keybinds extends API {
  constructor () {
    super();
    this.keybinds = {};
    this._module = 'API';
    this._submodule = 'Keybinds';
  }

  stop () {
    delete vizality.api.keybinds;
    this.removeAllListeners();
  }

  /**
   * Registers a keybind.
   * @param {VizalityKeybind} keybind Keybind
   */
  async registerKeybind (keybind) {
    try {
      if (this.keybinds[keybind.keybindId]) {
        throw new Error(`Keybind "${keybind.keybindId}" is already registered!`);
      }

      const options = {
        blurred: false,
        focused: true,
        keydown: false,
        keyup: true
      };

      keybind.eventId = Math.floor(100000 + Math.random() * 900000);
      keybind.options = keybind.options || options;

      await this._registerKeybind(keybind);
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Unregisters a keybind.
   * @param {string} keybindId ID of the keybind to unregister
   */
  async unregisterKeybind (keybindId) {
    try {
      if (!this.keybinds[keybindId]) {
        throw new Error(`Keybind "${keybindId}" is not registered!`);
      }
      await this._unregisterKeybind(this.keybinds[keybindId]);
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Changes a keybind.
   * @param {string} keybindId ID of the keybind to unregister
   * @param {string} newShortcut New shortcut to bind
   */
  async changeKeybindShortcut (keybindId, newShortcut) {
    try {
      if (!this.keybinds[keybindId]) {
        throw new Error(`Keybind "${keybindId}" is not registered!`);
      }
      const keybind = this.keybinds[keybindId];
      await this._unregisterKeybind(this.keybinds[keybindId]);
      keybind.shortcut = newShortcut;
      await this._registerKeybind(keybind);
    } catch (err) {
      return this.error(err);
    }
  }

  /** @private */
  async _registerKeybind (keybind) {
    try {
      await DiscordNative.nativeModules.ensureModule('discord_utils');
      const discordUtils = DiscordNative.nativeModules.requireModule('discord_utils');
      discordUtils.inputEventRegister(keybind.eventId, this._shortcutToKeyCode(keybind.shortcut), keybind.executor, keybind.options);
      this.keybinds[keybind.keybindId] = keybind;
      this.keybinds[keybind.keybindId].keyCode = this._shortcutToKeyCode(keybind.shortcut);
    } catch (err) {
      return this.error(err);
    }
  }

  /** @private */
  async _unregisterKeybind (keybind) {
    try {
      await DiscordNative.nativeModules.ensureModule('discord_utils');
      const discordUtils = DiscordNative.nativeModules.requireModule('discord_utils');
      discordUtils.inputEventUnregister(keybind.eventId);
      delete this.keybinds[keybind.keybindId];
    } catch (err) {
      return this.error(err);
    }
  }

  /** @private */
  _getVirtualKeyCode (key) {
    const os = DiscordNative.process.platform;
    const { keyToCode } = getModule('keyToCode');

    if (os === 'linux') {
      if (key === 'ctrl') key = 'left ctrl';
      if (key === 'alt') key = 'left alt';
      if (key === 'shift') key = 'left shift';
    }

    if (key === 'rctrl') key = 'right ctrl';
    if (key === 'ralt') key = 'right alt';
    if (key === 'rshift') key = 'right shift';

    return keyToCode(key);
  }

  /**
   * 
   * @see {@link https://github.com/ianstormtaylor/is-hotkey}
   * @private
   */
  _shortcutToKeyCode (shortcut) {
    try {
      const keysHolder = [];
      const keys = shortcut.split('+');
      for (let key of keys) {
        key = this._getVirtualKeyCode(key);
        keysHolder.push([ 0, key ]);
      }
      return keysHolder;
    } catch (err) {
      return this.error(err);
    }
  }
}
