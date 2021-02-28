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

import { existsSync } from 'fs';
import { join } from 'path';

import { Events, Directories } from '@vizality/constants';
import { assertObject } from '@vizality/util/object';
import { assertString } from '@vizality/util/string';
import { assertArray } from '@vizality/util/array';
import { getCaller } from '@vizality/util/file';
import { Icon } from '@vizality/components';
import { API } from '@vizality/entities';

let commands = [];

/**
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
 * @extends API
 * @extends Events
 */
export default class Commands extends API {
  constructor () {
    super();
    this._labels = [ 'API', 'Commands' ];
  }

  /**
   * Shuts down the API, removing all listeners and stored objects.
   */
  stop () {
    try {
      delete vizality.api.commands;
      this.removeAllListeners();
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Gets the custom command prefix.
   */
  get prefix () {
    try {
      return vizality.settings.get('commandPrefix', '.');
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Registers a command.
   * @param {VizalityCommand} command Command to register
   */
  registerCommand (command) {
    try {
      assertObject(command);
      assertString(command.command);
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
      return this.error(err);
    }
  }

  /**
   * Executes a command programmatically.
   * @param {string} commandName Command name
   */
  async invokeCommand (commandName) {
    try {
      if (!this.isCommand(commandName)) {
        throw new Error(`Command "${commandName}" could not be found!`);
      }
      try {
        await this.getCommandByName(commandName).executor();
      } catch (err) {
        return this.error(err);
      }
      this.emit(Events.VIZALITY_COMMAND_INVOKE, commandName);
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Checks if a command is registered.
   * @param {string} commandName Command name
   * @returns {boolean} Whether a command with a given name is registered
   */
  isCommand (commandName) {
    try {
      return Boolean(this.getCommandByName(commandName));
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Checks if a command has subcommands.
   * @param {string} commandName Command name
   * @returns {boolean} Whether a command with a given name has subcommands
   */
  hasSubcommands (commandName) {
    try {
      return Boolean(this.getCommandByName(commandName).subcommand?.length);
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Gets the first command found matching a given filter.
   * @param {Function} filter Function to use to filter commands by
   * @returns {Object|null} Command matching a given filter
   */
  getCommand (filter) {
    try {
      return commands.find(filter);
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Gets a command matching a given name.
   * @param {string} commandName Command name
   * @returns {Object|null} Command matching a given name
   */
  getCommandByName (commandName) {
    try {
      return commands.find(command => command.command === commandName);
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Gets all commands found matching a given filter.
   * @param {Function} filter Function to use to filter commands by
   * @returns {Array<Object|null>} Commands matching a given filter
   */
  getCommands (filter) {
    try {
      return commands.filter(filter);
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Gets all commands matching a given caller.
   * @param {string} addonId Addon ID
   * @returns {Array<Object|null>} Commands matching a given caller
   */
  getCommandsByCaller (addonId) {
    try {
      return commands.filter(command => command.caller === addonId);
    } catch (err) {
      return this.error(err);
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
      return this.error(err);
    }
  }

  /**
   * Unregisters a command.
   * @param {string} commandName Command name
   * @emits Commands#Events.VIZALITY_COMMAND_REMOVE
   */
  unregisterCommand (commandName) {
    try {
      if (!this.isCommand(commandName)) {
        throw new Error(`Command "${commandName}" is not registered, so it cannot be unregistered!`);
      }
      commands = this.getCommands(command => command.command !== commandName);
      this.emit(Events.VIZALITY_COMMAND_REMOVE, commandName);
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Unregisters all commands matching a given caller.
   * @param {string} addonId Addon ID
   * @emits Commands#Events.VIZALITY_COMMAND_REMOVE_ALL_BY_CALLER
   */
  unregisterCommandsByCaller (addonId) {
    try {
      commands = commands.filter(command => command.caller !== addonId);
      this.emit(Events.VIZALITY_COMMAND_REMOVE_ALL_BY_CALLER, addonId);
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Unregisters all commands.
   * @emits Commands#Events.VIZALITY_COMMAND_REMOVE_ALL
   */
  unregisterAllCommands () {
    try {
      commands = [];
      this.emit(Events.VIZALITY_COMMAND_REMOVE_ALL);
    } catch (err) {
      return this.error(err);
    }
  }
}
