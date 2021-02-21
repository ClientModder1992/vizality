import { isObject, isEmptyObject } from '@vizality/util/object';
import { getCaller } from '@vizality/util/file';
import { API } from '@vizality/entities';

/**
 * @typedef VizalityCommand
 * @property {string} command Command name
 * @property {string[]} aliases Command aliases
 * @property {string} description Command description
 * @property {string} usage Command usage
 * @property {Function} executor Command executor
 * @property {Function|undefined} autocomplete Autocompletion method
 * @property {boolean|undefined} showTyping Whether typing status should be shown or not
 */

/**
 * Vizality chat commands API.
 * @property {object.<string, VizalityCommand>} commands Registered commands
 */
export default class Commands extends API {
  constructor () {
    super();
    this.commands = {};
    this._module = 'API';
    this._submodule = 'Commands';
  }

  get prefix () {
    return vizality.settings.get('prefix', '.');
  }

  get find () {
    const arr = Object.values(this.commands);
    return arr.find.bind(arr);
  }

  get filter () {
    const arr = Object.values(this.commands);
    return arr.filter.bind(arr);
  }

  get map () {
    const arr = Object.values(this.commands);
    return arr.map.bind(arr);
  }

  get sort () {
    const arr = Object.values(this.commands);
    return arr.sort.bind(arr);
  }

  /**
   * Registers a command.
   * @param {VizalityCommand} command Command to register
   */
  registerCommand (command) {
    /**
     * @note Hacky way to get the caller of the command. Check if it's a plugin first. If
     * it's not, check if it's a builtin. If it's not, consider it a core Vizality command.
     */
    const caller = getCaller();

    try {
      if (!isObject(command) || isEmptyObject(command)) {
        throw new Error('Command must be a non-empty object!');
      }

      if (this.commands[command.command]) {
        throw new Error(`Command "${command.command}" is already registered!`);
      }

      this.commands[command.command] = {
        ...command,
        caller
      };
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Unregisters a command.
   * @param {string} command Command name to unregister
   */
  unregisterCommand (command) {
    try {
      if (!this.commands[command]) {
        throw new Error(`Command "${command}" is not registered!`);
      }

      delete this.commands[command];
    } catch (err) {
      return this.error(err);
    }
  }

  stop () {
    delete vizality.api.commands;
    this.removeAllListeners();
  }
}
