import { API } from '@vizality/entities';

/**
 * @typedef DiscordRpcEvent
 * @todo Dig into Discord's more complex selectors (seem to be mongo-ish).
 * @todo Document validation field
 * @property {string} scope RPC scope required
 * @property {function(object): void} handler RPC event handler
 * @property {any|undefined} validation Validator for incoming data
 */

/**
 * API to tinker with Discord's RPC socket.
 * @property {object.<string, function(string): boolean>} scopes RPC Scopes
 * @property {object.<string, DiscordRpcEvent>} scopes RPC Scopes
 */
export default class RPC extends API {
  constructor () {
    super();
    this.scopes = {};
    this.events = {};
    this.commands = {};
    this._module = 'API';
    this._submodule = 'RPC';
  }

  stop () {
    delete vizality.api.rpc;
    this.removeAllListeners();
  }

  /**
   * Registers a RPC scope.
   * @param {string} scope RPC scope
   * @param {function(string): boolean} grant Grant method. Receives the origin as first argument
   * @emits RpcAPI#scopeAdd
   */
  registerScope (scopeId, grant) {
    if (this.scopes[scopeId]) {
      throw new Error(`RPC scope "${scopeId}" is already registered!`);
    }
    this.scopes[scopeId] = grant;
    this.emit('scopeAdd', scopeId);
  }

  /**
   * Registers an RPC event.
   * @param {string} name Event name
   * @param {DiscordRpcEvent} properties RPC event properties
   * @emits RpcAPI#eventAdd
   */
  registerEvent (event) {
    if (this.events[event.name]) {
      throw new Error(`RPC event ${event.name} is already registered!`);
    }
    if (!event.handler) event.handler = () => {}
    this.events[event.name] = event;
    this.emit('eventAdd', event.name);
  }

  /**
   * Registers an RPC command.
   * @param {string} name Command name
   * @param {DiscordRpcEvent} properties RPC command properties
   * @emits RpcAPI#eventAdd
   */
  registerCommand (command) {
    if (this.commands[command.name]) {
      throw new Error(`RPC command ${command.name} is already registered!`);
    }
    this.commands[command.name] = command;
    this.emit('commandAdd', command.name);
  }

  /**
   * Unregisters a scope.
   * @param {string} scope Scope ID
   * @emits RpcAPI#scopeRemove
   */
  unregisterScope (scope) {
    if (this.scopes[scope]) {
      delete this.scopes[scope];
      this.emit('scopeRemove', scope);
    }
  }

  /**
   * Unregisters an event.
   * @param {string} eventId Event ID
   * @emits RpcAPI#eventRemove
   */
  unregisterEvent (eventId) {
    if (this.events[eventId]) {
      delete this.events[eventId];
      this.emit('eventRemove', eventId);
    }
  }

  /**
   * Unregisters a command.
   * @param {string} commandId Command ID
   * @emits RpcAPI#commandRemove
   */
  unregisterCommand (commandId) {
    if (this.commands[commandId]) {
      delete this.commands[commandId];
      this.emit('commandRemove', commandId);
    }
  }
}
