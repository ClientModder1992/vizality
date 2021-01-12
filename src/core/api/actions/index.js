import { error } from '@vizality/util/logger';
import { API } from '@vizality/entities';

/**
 * @typedef VizalityActions
 * @property {string} name Action name
 * @property {Function} action The action to be performed
 */

/**
 * Vizality Actions API
 * @property {VizalityAction[]} actions Registered actions
 */
export default class Actions extends API {
  constructor () {
    super();
    this.actions = [];
    this._module = 'API';
    this._submodule = 'Actions';
  }

  /**
   * Registers an action
   * @param {Function} action Action to perform
   * @emits ActionsAPI#actionAdded
   * @returns {void}
   */
  registerAction (action) {
    try {
      if (this.actions.find(a => a.action === action.id)) {
        throw new Error(`Action "${action.id}" is already registered!`);
      }

      if (!action.executor) {
        throw new Error(`Must specify property "action"!`);
      }

      if (typeof action.executor !== 'function') {
        throw new Error(`Property "action" value must be a function!`);
      }

      this.actions.push(action);
      this.emit('actionAdded', action);
    } catch (err) {
      return error(this._module, `${this._submodule}:registerAction`, null, err);
    }
  }

  /**
   * Unregisters an action
   * @param {string} id Name of the action
   * @emits ActionAPI#actionRemoved
   * @returns {void}
   */
  unregisterAction (id) {
    try {
      if (this.actions.find(a => a.id === id)) {
        this.actions = this.actions.filter(r => r.action !== id);
        this.emit('actionRemoved', id);
      } else {
        throw new Error(`Action "${id}" is not registered, so it cannot be unregistered!`);
      }
    } catch (err) {
      return error(this._module, `${this._submodule}:unregisterAction`, null, err);
    }
  }

  /**
   * Invokes an action.
   * @param {string} id Name of the action
   * @returns {void}
   */
  async invoke (id) {
    try {
      this.actions.find(a => a.id === id).executor();
    } catch (err) {
      return error(this._module, `${this._submodule}:invoke`, null, err);
    }
  }
}
