/**
 * The keybinds  API is meant for registering keyboard shortcuts to perform some task.
 * Includes options to activate keybinds both globally (while the app is not focused) and
 * locally (while the app is focused).
 * @module Keybinds
 * @memberof API
 * @namespace API.Keybinds
 * @version 1.0.0
 */

/**
 * @typedef VizalityKeybind
 * @property {string} [id] Keybind ID
 * @property {string} shortcut Keyboard shortcut
 * @property {Function} executor Keybind executor
 * @property {Object} [options] Keybind options
 * @property {boolean} [options.blurred=false] Whether the keybind should activate while Discord is unfocused
 * @property {boolean} [options.focused=true] Whether the keybind should activate while Discord is focused
 * @property {boolean} [options.keydown=false] Whether the keybind should activate on keydown
 * @property {boolean} [options.keyup=true] Whether the keybind should activate on keyup
 * @property {Array<Array<number>>} keyCode Matrix of keycodes. This property is set automatically based on the provided shortcut.
 * @property {string} eventId Keybind event ID. This property is set automatically.
 * @property {string} caller Addon ID of keybind registrar. This property is set automatically.
 */

import Constants from '@vizality/constants';
import Entities from '@vizality/entities';
import Webpack from '@vizality/webpack';
import Util from '@vizality/util';

const discordUtils = DiscordNative?.nativeModules?.requireModule('discord_utils');

/**
 * All currently registered keybinds.
 * Accessed with `getAllKeybinds` below.
 */
let keybinds = [];

/**
 * @extends Entities.API
 * @extends Events
 */
export default class Keybinds extends Entities.API {
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
   * @emits Keybinds#Constants.Events.VIZALITY_KEYBIND_ADD
   */
  registerKeybind (keybind) {
    try {
      Util.object.assertObject(keybind);
      keybind.caller = Util.file.getCaller();
      keybind.id = keybind.id || `${Util.string.toSnakeCase(keybind.caller).toUpperCase()}_KEYBIND_${this.getKeybindsByCaller(keybind.caller)?.length + 1 || '1'}`;
      Util.string.assertString(keybind.id);
      if (this.isKeybind(keybind.id)) {
        throw new Error(`Keybind "${keybind.id}" is already registered!`);
      }
      if (!keybind.shortcut) {
        throw new Error('Keybind must contain a shortcut!');
      }
      Util.string.assertString(keybind.shortcut);
      if (!keybind.executor) {
        throw new Error('Keybind must contain an executor!');
      }
      if (typeof keybind.executor !== 'function') {
        throw new TypeError('Keybind executor must be a function!');
      }
      const options = {
        blurred: false,
        focused: true,
        keydown: false,
        keyup: true
      };
      // Just assigning the event ID a randomly large number
      keybind.eventId = Math.floor(100000 + Math.random() * 900000);
      keybind.options = keybind.options || options;
      Util.object.assertObject(keybind.options);
      keybind.shortcut = keybind.shortcut.toLowerCase();
      if (this.getKeybindByShortcut(keybind.shortcut)) {
        throw new TypeError(`Keybind shortcut "${keybind.shortcut} is already in use!`);
      }
      keybind.keyCode = this.shortcutToKeyCode(keybind.shortcut);
      // Utilize Discord's internal keybind registrar
      discordUtils.inputEventRegister(keybind.eventId, keybind.keyCode, keybind.executor, keybind.options);
      keybinds.push(keybind);
    } catch (err) {
      return this.error(this._labels.concat('registerKeybind'), err);
    }
  }

  /**
   * Invokes a keybind executor.
   * @param {string} keybindId Keybind ID
   */
  async invokeKeybind (keybindId) {
    try {
      Util.string.assertString(keybindId);
      if (!this.isKeybind(keybindId)) {
        throw new Error(`Keybind "${keybindId}" could not be found!`);
      }
      try {
        await this.getKeybindById(keybindId).executor();
      } catch (err) {
        return this.error(this._labels.concat('invokeKeybind'), `There was a problem invoking keybind "${keybindId}" executor!`, err);
      }
    } catch (err) {
      return this.error(this._labels.concat('invokeKeybind'), err);
    }
  }

  /**
   * Changes a keybind.
   * @param {string} keybindId ID of the keybind to unregister
   * @param {string} newShortcut New shortcut to bind
   */
  changeKeybindShortcut (keybindId, newShortcut) {
    try {
      Util.string.assertString(keybindId);
      Util.string.assertString(newShortcut);
      const keybind = this.getKeybindById(keybindId);
      if (!keybind) {
        throw new Error(`Keybind "${keybindId}" is not registered!`);
      }
      this.unregisterKeybind(keybindId);
      keybind.shortcut = newShortcut;
      this.registerKeybind(keybind);
    } catch (err) {
      return this.error(this._labels.concat('changeKeybindShortcut'), err);
    }
  }

  /**
   * Checks if a keybind is registered.
   * @param {string} keybindIdOrShortcut Keybind ID or keybind shortcut
   * @returns {boolean} Whether a keybind with a given ID is registered
   */
  isKeybind (keybindIdOrShortcut) {
    try {
      Util.string.assertString(keybindIdOrShortcut);
      return (
        Boolean(this.getKeybindById(keybindIdOrShortcut)) ||
        Boolean(this.getKeybindByShortcut(keybindIdOrShortcut))
      );
    } catch (err) {
      return this.error(this._labels.concat('isKeybind'), err);
    }
  }

  /**
   * Gets the first keybind found matching a given filter.
   * @param {Function} filter Function to use to filter keybinds by
   * @returns {Object|null} Keybind matching a given filter
   */
  getKeybind (filter) {
    try {
      if (!filter?.length) return null;
      return keybinds.find(filter);
    } catch (err) {
      return this.error(this._labels.concat('getKeybind'), err);
    }
  }

  /**
   * Gets a keybind matching a given ID.
   * @param {string} keybindId Keybind ID
   * @returns {Object|null} Keybind matching a given ID
   */
  getKeybindById (keybindId) {
    try {
      Util.string.assertString(keybindId);
      return keybinds.find(keybind => keybind.id === keybindId);
    } catch (err) {
      return this.error(this._labels.concat('getKeybindById'), err);
    }
  }

  /**
   * Gets a keybind matching a given shortcut.
   * @param {string} shortcut Keybind shortcut
   * @returns {Object|null} Keybind matching a given shortcut
   */
  getKeybindByShortcut (shortcut) {
    try {
      Util.string.assertString(shortcut);
      return keybinds.find(keybind => keybind.shortcut === shortcut);
    } catch (err) {
      return this.error(this._labels.concat('getKeybindByShortcut'), err);
    }
  }

  /**
   * Gets all keybinds found matching a given filter.
   * @param {Function} filter Function to use to filter keybinds by
   * @returns {Array<Object|null>} Keybinds matching a given filter
   */
  getKeybinds (filter) {
    try {
      if (!filter?.length) return null;
      return keybinds.filter(filter);
    } catch (err) {
      return this.error(this._labels.concat('getKeybinds'), err);
    }
  }

  /**
   * Gets all keybinds matching a given caller.
   * @param {string} addonId Addon ID
   * @returns {Array<Object|null>} Keybinds matching a given caller
   */
  getKeybindsByCaller (addonId) {
    try {
      Util.string.assertString(addonId);
      return keybinds.filter(keybind => keybind.caller === addonId);
    } catch (err) {
      return this.error(this._labels.concat('getKeybindsByCaller'), err);
    }
  }

  /**
   * Gets all keybinds.
   * @returns {Array<Object|null>} All keybinds
   */
  getAllKeybinds () {
    try {
      return keybinds;
    } catch (err) {
      return this.error(this._labels.concat('getAllKeybinds'), err);
    }
  }

  /**
   * Converts a key or modifier into a usable keycode.
   * @param {string} key Key or modifier
   * @returns {key} Key code (event.which)
   */
  getVirtualKeyCode (key) {
    Util.string.assertString(key);
    const os = DiscordNative?.process?.platform;
    const { keyToCode } = Webpack.getModule('keyToCode');
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
   * Converts a string shortcut matrix of keycodes.
   * @see {@link https://github.com/ianstormtaylor/is-hotkey}
   * @param {string} shortcut Keybind shortcut
   * @returns {Array<Array<number>>} Returns a matrix of keycodes
   */
  shortcutToKeyCode (shortcut) {
    try {
      Util.string.assertString(shortcut);
      const keysHolder = [];
      const keys = shortcut.split('+');
      for (let key of keys) {
        key = this.getVirtualKeyCode(key);
        keysHolder.push([ 0, key ]);
      }
      return keysHolder;
    } catch (err) {
      return this.error(this._labels.concat('shortcutToKeyCode'), err);
    }
  }

  /**
   * Unregisters a keybind.
   * @param {string} keybindId Keybind ID
   * @emits Keybinds#Constants.Events.VIZALITY_KEYBIND_REMOVE
   */
  unregisterKeybind (keybindId) {
    try {
      Util.string.assertString(keybindId);
      const keybind = this.getKeybindById(keybindId);
      if (!keybind) {
        throw new Error(`Keybind "${keybindId}" is not registered, so it cannot be unregistered!`);
      }
      discordUtils.inputEventUnregister(keybind.eventId);
      keybinds = this.getKeybinds(keybind => keybind.id !== keybindId);
      this.emit(Constants.Events.VIZALITY_KEYBIND_REMOVE, keybindId);
    } catch (err) {
      return this.error(this._labels.concat('unregisterKeybind'), err);
    }
  }

  /**
   * Unregisters all keybinds matching a given caller.
   * @param {string} addonId Addon ID
   * @emits Keybinds#Constants.Events.VIZALITY_KEYBIND_REMOVE_ALL_BY_CALLER
   */
  unregisterKeybindsByCaller (addonId) {
    try {
      Util.string.assertString(addonId);
      keybinds = keybinds.filter(keybind => keybind.caller !== addonId);
      this.emit(Constants.Events.VIZALITY_KEYBIND_REMOVE_ALL_BY_CALLER, addonId);
    } catch (err) {
      return this.error(this._labels.concat('unregisterKeybindsByCaller'), err);
    }
  }

  /**
   * Unregisters all keybinds.
   * @emits Keybinds#Constants.Events.VIZALITY_KEYBIND_REMOVE_ALL
   */
  unregisterAllKeybinds () {
    try {
      for (const keybind of keybinds) {
        this.unregisterKeybind(keybind.id);
      }
      // Make sure no keybinds are left
      keybinds = [];
      this.emit(Constants.Events.VIZALITY_KEYBIND_REMOVE_ALL);
    } catch (err) {
      return this.error(this._labels.concat('unregisterAllKeybinds'), err);
    }
  }
}
