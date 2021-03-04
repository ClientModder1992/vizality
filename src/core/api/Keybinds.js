/**
 * The keybinds  API is meant for registering keyboard shortcuts to perform actions.
 * Includes options to activate keybinds both globally (while the app is not focused) and
 * locally (while the app is focused).
 * @module Keybinds
 * @memberof API
 * @namespace API.Keybinds
 * @version 1.0.0
 */

/*
 * @todo If no ID is provided, automatically sets the ID in the form of "ADDON_NAME_ACTION_1"
 * const actionId = action.id || `${toSnakeCase(caller).toUpperCase()}_ACTION_${this.getActionsByCaller(caller)?.length + 1 || '1'}`;
 * aliases property
 */

/**
 * @typedef VizalityKeybind
 * @property {string} [id] Keybind ID
 * @property {string} shortcut Keyboard shortcut
 * @property {Function} executor Executor action
 * @property {Object} [options] Keybind options
 * @property {boolean} [options.blurred=false] Whether the keybind should activate while Discord is unfocused
 * @property {boolean} [options.focused=true] Whether the keybind should activate while Discord is focused
 * @property {boolean} [options.keydown=false] Whether the keybind should activate on keydown
 * @property {boolean} [options.keyup=true] Whether the keybind should activate on keyup
 * @property {Array<Array>} keyCode Keybind event ID. This property is set automatically.
 * @property {string} eventId Keybind event ID. This property is set automatically.
 * @property {string} caller Addon ID of keybind registrar. This property is set automatically.
 */


import { getModule } from '@vizality/webpack';
import { API } from '@vizality/entities';

/**
 * All currently registered keybinds.
 * Accessed with `getAllKeybinds` below.
 */
let keybinds = [];

/**
 * @extends API
 * @extends Events
 */
export default class Keybinds extends API {
  /**
   * Shuts down the API, removing all listeners and stored objects.
   */
  stop () {
    try {
      this.unregisterAllKeybinds();
      delete vizality.api.keybinds;
      this.removeAllListeners();
    } catch (err) {
      return this.error('There was an error unloading the Keybinds API!', err);
    }
  }

  /**
   * Registers a keybind.
   * @param {VizalityKeybind} keybind Keybind to register
   */
  registerKeybind (keybind) {
    try {
      assertObject(keybind);
      if (this.isCommand(command.command)) {
        throw new Error(`Command "${command.command}" is already registered!`);
      }
      if (!command.executor) {
        throw new Error('Command must contain an executor!');
      }
      if (typeof command.executor !== 'function') {
        throw new TypeError('Command executor must be a function!');
      }
      if (command.icon) {
        if (Icon.Names.includes(command.icon)) {
          if (existsSync(join(Directories.ASSETS, 'svg', `${command.icon}.svg`))) {
            command.icon = `vz-asset://svg/${command.icon}.svg`;
          } else if (existsSync(join(Directories.ASSETS, 'logo', `${command.icon}.svg`))) {
            command.icon = `vz-asset://logo/${command.icon}.svg`;
          }
        }
      }
      if (command.aliases) {
        assertArray(command.aliases);
        command.aliases = command.aliases.map(alias => alias.toLowerCase());
      }
      const caller = getCaller();
      commands.push({
        ...command,
        caller
      });
    } catch (err) {
      return this.error(this._labels.concat('registerCommand'), err);
    }
  }

  /**
   * Registers a keybind.
   * @param {VizalityKeybind} keybind Keybind to register
   * @emits Keybinds#Events.VIZALITY_KEYBIND_ADD
   */
  registerKeybind (keybind) {
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
      this._registerKeybind(keybind);
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Unregisters a keybind.
   * @param {string} keybindId ID of the keybind to unregister
   */
  unregisterKeybind (keybindId) {
    try {
      if (!this.keybinds[keybindId]) {
        throw new Error(`Keybind "${keybindId}" is not registered!`);
      }
      this._unregisterKeybind(this.keybinds[keybindId]);
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Changes a keybind.
   * @param {string} keybindId ID of the keybind to unregister
   * @param {string} newShortcut New shortcut to bind
   */
  changeKeybindShortcut (keybindId, newShortcut) {
    try {
      if (!this.keybinds[keybindId]) {
        throw new Error(`Keybind "${keybindId}" is not registered!`);
      }
      const keybind = this.keybinds[keybindId];
      this._unregisterKeybind(this.keybinds[keybindId]);
      keybind.shortcut = newShortcut;
      this._registerKeybind(keybind);
    } catch (err) {
      return this.error(err);
    }
  }

  /** @private */
  _registerKeybind (keybind) {
    try {
      const discordUtils = DiscordNative.nativeModules.requireModule('discord_utils');
      discordUtils.inputEventRegister(keybind.eventId, this._shortcutToKeyCode(keybind.shortcut), keybind.executor, keybind.options);
      this.keybinds[keybind.keybindId] = keybind;
      this.keybinds[keybind.keybindId].keyCode = this._shortcutToKeyCode(keybind.shortcut);
    } catch (err) {
      return this.error(err);
    }
  }

  /** @private */
  _unregisterKeybind (keybind) {
    try {
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
