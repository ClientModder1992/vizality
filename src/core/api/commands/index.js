import { API } from '@vizality/entities';

/**
 * @typedef VizalityChatCommand
 * @property {string} command Command name
 * @property {string[]} aliases Command aliases
 * @property {string} description Command description
 * @property {string} usage Command usage
 * @property {Function} executor Command executor
 * @property {Function|undefined} autocomplete Autocompletion method
 * @property {boolean|undefined} showTyping Whether typing status should be shown or not
 */

/**
 * Vizality chat commands API
 * @property {Object.<string, VizalityChatCommand>} commands Registered commands
 */
export default class CommandsAPI extends API {
  constructor () {
    super();
    this.commands = {};
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
   * Registers a command
   * @param {VizalityChatCommand} command Command to register
   */
  registerCommand (command) {
    // @todo: remove this once there's a proper implemention (if any) for fetching the command origin.
    const stackTrace = (new Error()).stack;
    const [ , origin ] = stackTrace.match(new RegExp(`${global._.escapeRegExp(vizality.manager.plugins.dir)}.([-\\w]+)`)) ||
      stackTrace.match(new RegExp(`${global._.escapeRegExp(vizality.manager.builtins.dir)}.([-\\w]+)`));

    if (typeof command === 'string') {
      console.error('no');
      return;
    }
    if (this.commands[command.command]) {
      /* @todo: Use logger. */
      throw new Error(`Command ${command.command} is already registered!`);
    }

    this.commands[command.command] = {
      ...command,
      origin
    };
  }

  /**
   * Unregisters a command
   * @param {string} command Command name to unregister
   */
  unregisterCommand (command) {
    if (this.commands[command]) {
      delete this.commands[command];
    }
  }
}
