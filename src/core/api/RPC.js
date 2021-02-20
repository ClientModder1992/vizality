import { getCaller } from '@vizality/util/file';
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
   * Registers a scope.
   * @param {string} scopeId Scope ID
   * @param {function(string): boolean} grant Grant method. Receives the origin as first argument
   * @emits RPC#scopeAdd
   */
  registerScope (scopeId, grant) {
    try {
      if (!scopeId) {
        throw new Error('RPC scope must contain a valid ID!');
      }
      if (this.scopes[scopeId]) {
        throw new Error(`RPC scope ID "${scopeId}" is already registered!`);
      }
      this.scopes[scopeId] = {};
      this.scopes[scopeId].caller = getCaller();
      this.scopes[scopeId].grant = grant;
      this.emit('scopeAdd', scopeId);
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Registers an event.
   * @param {DiscordRpcEvent} event Event properties
   * @emits RPC#eventAdd
   */
  registerEvent (event) {
    try {
      if (!event?.id) {
        throw new Error('RPC command must contain a valid ID!');
      }
      // @todo Ask AAGaming about other properties
      if (this.events[event.id]) {
        throw new Error(`RPC event ID "${event.id}" is already registered!`);
      }
      // eslint-disable-next-line no-empty-function
      if (!event.handler) event.handler = () => {};
      event.caller = getCaller();
      this.events[event.id] = event;
      this.emit('eventAdd', event.id);
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Registers a command.
   * @param {DiscordRpcEvent} command Command properties
   * @emits RPC#eventAdd
   */
  registerCommand (command) {
    try {
      if (!command?.id) {
        throw new Error('RPC command must contain a valid ID!');
      }
      if (!command.scope) {
        throw new Error(`RPC command ID "${command.id} cannot be registered without a valid scope!`);
      }
      if (!command.handler || typeof command.handler !== 'function') {
        throw new Error(`RPC command ID "${command.id} cannot be registered without a valid handler!`);
      }
      if (this.commands[command.id]) {
        throw new Error(`RPC command ID "${command.id}" is already registered!`);
      }
      command.caller = getCaller();
      this.commands[command.id] = command;
      this.emit('commandAdd', command.id);
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Unregisters a scope.
   * @param {string} scopeId Scope ID
   * @emits RPC#scopeRemove
   */
  unregisterScope (scopeId) {
    try {
      if (!scopeId) {
        throw new Error(`Invalid RPC scope ID provided!`);
      }
      if (!this.scopes[scopeId]) {
        throw new Error(`RPC scope ID "${scopeId}" is not registered, so it cannot be unregistered!`);
      }
      delete this.scopes[scopeId];
      this.emit('scopeRemove', scopeId);
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Unregisters an event.
   * @param {string} eventId Event ID
   * @emits RPC#eventRemove
   */
  unregisterEvent (eventId) {
    try {
      if (!eventId) {
        throw new Error(`Invalid RPC event ID provided!`);
      }
      if (!this.events[eventId]) {
        throw new Error(`RPC event ID "${eventId}" is not registered, so it cannot be unregistered!`);
      }
      delete this.events[eventId];
      this.emit('eventRemove', eventId);
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Unregisters a command.
   * @param {string} commandId Command ID
   * @emits RPC#commandRemove
   */
  unregisterCommand (commandId) {
    try {
      if (!commandId) {
        throw new Error(`Invalid RPC command ID provided!`);
      }
      if (!this.commands[commandId]) {
        throw new Error(`RPC command ID "${commandId}" is not registered, so it cannot be unregistered!`);
      }
      delete this.commands[commandId];
      this.emit('commandRemove', commandId);
    } catch (err) {
      return this.error(err);
    }
  }
}
