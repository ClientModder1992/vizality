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
  registerScope (scope, grant) {
    if (this.scopes[scope]) {
      throw new Error(`RPC scope ${scope} is already registered!`);
    }
    this.scopes[scope] = grant;
    this.emit('scopeAdd', scope);
  }

  /**
   * Registers an RPC event.
   * @param {string} name Event name
   * @param {DiscordRpcEvent} properties RPC event properties
   * @emits RpcAPI#eventAdd
   */
  registerEvent (name, properties) {
    if (this.events[name]) {
      throw new Error(`RPC event ${name} is already registered!`);
    }
    if (!properties.handler) properties.handler = () => {}
    this.events[name] = properties;
    this.emit('eventAdd', name);
  }

  /**
   * Registers an RPC command.
   * @param {string} name Command name
   * @param {DiscordRpcEvent} properties RPC command properties
   * @emits RpcAPI#eventAdd
   */
  registerCommand (name, properties) {
    if (this.commands[name]) {
      throw new Error(`RPC command ${name} is already registered!`);
    }
    this.commands[name] = properties;
    this.emit('commandAdd', name);
  }

  /**
   * Unregisters a scope.
   * @param {string} scope Scope
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
   * @param {string} name Event name
   * @emits RpcAPI#eventRemove
   */
  unregisterEvent (name) {
    if (this.events[name]) {
      delete this.events[name];
      this.emit('eventRemove', name);
    }
  }

  /**
   * Unregisters a command.
   * @param {string} name Command name
   * @emits RpcAPI#commandRemove
   */
  unregisterCommand (name) {
    if (this.commands[name]) {
      delete this.commands[name];
      this.emit('commandRemove', name);
    }
  }
}
