import { error } from '@vizality/util/logger';
import { API } from '@vizality/entities';

/**
 * @typedef VizalityAction
 * @property {string} actionId Action ID
 * @property {Function} executor Action to be called
 */

/**
 * The Actions API is meant for registering useful, quick actions that may be
 * useful to be used in other plugins or contexts to call on the fly.
 * @class
 * @extends API Vizality API
 */
export default class Actions extends API {
  constructor () {
    super();
    /**
     * Stores registered actions.
     * @type {object}
     */
    this.actions = {};

    this._module = 'API';
    this._submodule = 'Actions';
  }

  /**
   * Registers an action.
   * @param {VizalityAction} action Action to register
   * @emits Actions#actionAdded
   * @returns {undefined}
   */
  registerAction (action) {
    try {
      if (this.actions[action.actionId]) {
        throw new Error(`Action "${action.actionId}" is already registered!`);
      }

      if (!action.executor) {
        throw new Error(`Action must specify property "action"!`);
      }

      if (typeof action.executor !== 'function') {
        throw new Error(`Action property "action" value must be a function!`);
      }

      this.actions[action.actionId] = action;
      this.emit('actionAdded', action);
    } catch (err) {
      return error(this._module, `${this._submodule}:registerAction`, null, err);
    }
  }

  /**
   * Unregisters an action.
   * @param {string} actionId Action ID
   * @emits Actions#actionRemoved
   * @returns {undefined}
   */
  unregisterAction (actionId) {
    try {
      if (this.actions[actionId]) {
        delete this.actions[actionId];
        this.emit('actionRemoved', actionId);
      } else {
        throw new Error(`Action "${actionId}" is not registered, so it cannot be unregistered!`);
      }
    } catch (err) {
      return error(this._module, `${this._submodule}:unregisterAction`, null, err);
    }
  }

  /**
   * Calls an action function.
   * @param {string} actionId Action ID
   * @emits Actions#actionInvoked
   * @returns {undefined}
   */
  async invoke (actionId) {
    try {
      if (this.actions[actionId]) {
        this.actions[actionId].executor();
        this.emit('actionInvoked', actionId);
      } else {
        throw new Error(`Action "${actionId}" could not be found!`);
      }
    } catch (err) {
      return error(this._module, `${this._submodule}:invoke`, null, err);
    }
  }
}
