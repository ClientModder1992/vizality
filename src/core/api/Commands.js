/**
 * The commands API is meant for registering commands that can be used in the chat message
 * bar, mimicing Discord's slash command user interface. For Vizality commands, you may set
 * a custom command prefix, which can be found in Vizality's Dashboard Settings.
 * @module Commands
 * @memberof API
 * @namespace API.Commands
 * @version 1.0.0
 */

/*
 * @todo Work out a better system for providing subcommands to make it much easier and less
 * painful; preferably getting rid of the autocomplete property and adding a subcommands array
 * property that would contain an array of VizalityCommand and would be processed like normal
 * commands, but as subcommands.
 */

/**
 * Vizality command object.
 * @typedef VizalityCommand
 * @property {string} command Command name
 * @property {Function} executor Command executor
 * @property {Array<string>} [aliases] Command aliases
 * @property {string} [icon] Command icon. This can be either an icon name or an image URL.
 * @property {string} [description] Command description
 * @property {Function} [autocomplete] Autocompletion method
 * @property {Array<VizalityCommand>|undefined} [subcommands] Command subcommands
 * @property {string} [source] Source text to the right in the autocomplete
 * @property {boolean} [showTyping=false] Whether typing status should be shown or not
 * @property {string} caller Addon ID of command registrar. This property is set automatically.
 */

/**
 * Vizality subcommand object.
 * @typedef VizalitySubcommand
 * @property {string} command Command name
 * @property {Function} executor Command executor
 * @property {Array<string>} [aliases] Command aliases
 * @property {string} [icon] Command icon. This can be either an icon name or an image URL.
 * @property {string} [description] Command description
 * @property {Array<VizalityCommand>|undefined} [subcommands] Command subcommands
 * @property {string} [source] Source text to the right in the autocomplete
 */

import Components from '@vizality/components';
import Constants from '@vizality/constants';
import Entities from '@vizality/entities';
import Util from '@vizality/util';
import path from 'path';
import fs from 'fs';

/**
 * All currently registered commands.
 * Accessed with `getAllCommands` below.
 */
let commands = [];

/**
 * @extends API
 * @extends Events
 */
export default class Commands extends Entities.API {
  /**
   * Shuts down the API, removing all listeners and stored objects.
   */
  stop () {
    try {
      this.unregisterAllCommands();
      delete vizality.api.commands;
      this.removeAllListeners();
    } catch (err) {
      return this.error('There was an error unloading the Commands API!', err);
    }
  }

  /**
   * Gets the custom command prefix.
   */
  get prefix () {
    try {
      return vizality.settings.get('commandPrefix', '.');
    } catch (err) {
      return this.error(this._labels.concat('prefix'), err);
    }
  }

  /**
   * Registers a command.
   * @param {VizalityCommand} command Command to register
   */
  registerCommand (command) {
    try {
      Util.object.assertObject(command);
      Util.string.assertString(command.command);
      command.command = command.command.toLowerCase();
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
        if (Components.Icon.Names.includes(command.icon)) {
          if (fs.existsSync(path.join(Constants.Directories.ASSETS, 'svg', `${command.icon}.svg`))) {
            command.icon = `vz-asset://svg/${command.icon}.svg`;
          } else if (fs.existsSync(path.join(Constants.Directories.ASSETS, 'logo', `${command.icon}.svg`))) {
            command.icon = `vz-asset://logo/${command.icon}.svg`;
          }
        }
      }
      if (command.aliases) {
        Util.array.assertArray(command.aliases);
        command.aliases = command.aliases.map(alias => alias.toLowerCase());
      }
      command.caller = Util.file.getCaller();
      commands.push(command);
    } catch (err) {
      return this.error(this._labels.concat('registerCommand'), err);
    }
  }

  /**
   * Executes a command programmatically.
   * @param {string} commandName Command name
   */
  async invokeCommand (commandName) {
    try {
      Util.string.assertString(commandName);
      if (!this.isCommand(commandName)) {
        throw new Error(`Command "${commandName}" could not be found!`);
      }
      try {
        await this.getCommandByName(commandName).executor();
      } catch (err) {
        return this.error(this._labels.concat('invokeCommand'), `There was a problem invoking command "${commandName}" executor!`, err);
      }
    } catch (err) {
      return this.error(this._labels.concat('invokeCommand'), err);
    }
  }

  /**
   * Checks if a command is registered.
   * @param {string} commandName Command name
   * @returns {boolean} Whether a command with a given name is registered
   */
  isCommand (commandName) {
    try {
      Util.string.assertString(commandName);
      return Boolean(this.getCommandByName(commandName));
    } catch (err) {
      return this.error(this._labels.concat('isCommand'), err);
    }
  }

  /**
   * Checks if a command has subcommands.
   * @param {string} commandName Command name
   * @returns {boolean} Whether a command with a given name has subcommands
   */
  hasSubcommands (commandName) {
    try {
      Util.string.assertString(commandName);
      return Boolean(this.getCommandByName(commandName).subcommands?.length);
    } catch (err) {
      return this.error(this._labels.concat('hasSubcommands'), err);
    }
  }

  /**
   * Gets the first command found matching a given filter.
   * @param {Function} filter Function to use to filter commands by
   * @returns {Object|null} Command matching a given filter
   */
  getCommand (filter) {
    try {
      if (!filter?.length) return null;
      return commands.find(filter);
    } catch (err) {
      return this.error(this._labels.concat('getCommand'), err);
    }
  }

  /**
   * Gets a command matching a given name.
   * @param {string} commandName Command name
   * @returns {Object|null} Command matching a given name
   */
  getCommandByName (commandName) {
    try {
      Util.string.assertString(commandName);
      return commands.find(command => command.command === commandName);
    } catch (err) {
      return this.error(this._labels.concat('getCommandByName'), err);
    }
  }

  /**
   * Gets all commands found matching a given filter.
   * @param {Function} filter Function to use to filter commands by
   * @returns {Array<Object|null>} Commands matching a given filter
   */
  getCommands (filter) {
    try {
      if (!filter?.length) return null;
      return commands.filter(filter);
    } catch (err) {
      return this.error(this._labels.concat('getCommands'), err);
    }
  }

  /**
   * Gets all commands matching a given caller.
   * @param {string} addonId Addon ID
   * @returns {Array<Object|null>} Commands matching a given caller
   */
  getCommandsByCaller (addonId) {
    try {
      Util.string.assertString(addonId);
      return commands.filter(command => command.caller === addonId);
    } catch (err) {
      return this.error(this._labels.concat('getCommandsByCaller'), err);
    }
  }

  /**
   * Gets all commands.
   * @returns {Array<Object|null>} All commands
   */
  getAllCommands () {
    try {
      return commands;
    } catch (err) {
      return this.error(this._labels.concat('getAllCommands'), err);
    }
  }

  /**
   * Unregisters a command.
   * @param {string} commandName Command name
   * @emits Commands#Constants.Events.VIZALITY_COMMAND_REMOVE
   */
  unregisterCommand (commandName) {
    try {
      Util.string.assertString(commandName);
      if (!this.isCommand(commandName)) {
        throw new Error(`Command "${commandName}" is not registered, so it cannot be unregistered!`);
      }
      commands = this.getCommands(command => command.command !== commandName);
      this.emit(Constants.Events.VIZALITY_COMMAND_REMOVE, commandName);
    } catch (err) {
      return this.error(this._labels.concat('unregisterCommand'), err);
    }
  }

  /**
   * Unregisters all commands matching a given caller.
   * @param {string} addonId Addon ID
   * @emits Commands#Constants.Events.VIZALITY_COMMAND_REMOVE_ALL_BY_CALLER
   */
  unregisterCommandsByCaller (addonId) {
    try {
      Util.string.assertString(addonId);
      commands = commands.filter(command => command.caller !== addonId);
      this.emit(Constants.Events.VIZALITY_COMMAND_REMOVE_ALL_BY_CALLER, addonId);
    } catch (err) {
      return this.error(this._labels.concat('unregisterCommandsByCaller'), err);
    }
  }

  /**
   * Unregisters all commands.
   * @emits Commands#Constants.Events.VIZALITY_COMMAND_REMOVE_ALL
   */
  unregisterAllCommands () {
    try {
      commands = [];
      this.emit(Constants.Events.VIZALITY_COMMAND_REMOVE_ALL);
    } catch (err) {
      return this.error(this._labels.concat('unregisterAllCommands'), err);
    }
  }
}
