import { error } from '@vizality/util/logger';
import { API } from '@vizality/entities';

console.log(API);

const _module = 'Module';
const _submodule = 'API:Actions';

/**
 * @typedef VizalityActions
 * @property {string} name Action name
 * @property {Function} action The action to be performed
 */

/**
 * Vizality Actions API
 * @property {VizalityAction[]} actions Registered actions
 */
export default class ActionsAPI extends API {
  constructor () {
    super();
    this.actions = [];
  }

  /**
   * Registers an action
   * @param {Function} action Action to perform
   * @emits ActionsAPI#actionAdded
   * @returns {void}
   */
  registerAction (action) {
    try {
      if (this.actions.find(r => r.action === name)) throw new Error(`Action "${name}" is already registered!`);
      if (!action.executor) throw new Error(`"action" property must be specified!`);
      if (typeof action.executor !== 'function') throw new Error(`"action" property value must be a function!`);

      this.actions.push(action);
      this.emit('actionAdded', action);
    } catch (err) {
      return error(_module, `${_submodule}:registerAction`, null, err);
    }
  }

  /**
   * Unregisters an action
   * @param {string} name Name of the action
   * @emits ActionAPI#actionRemoved
   * @returns {void}
   */
  unregisterAction (name) {
    try {
      if (this.actions.find(r => r.action === name)) {
        this.actions = this.actions.filter(r => r.action !== name);
        this.emit('routeRemoved', name);
      } else {
        throw new Error(`Action "${name}" is not registered, so it cannot be unregistered!`);
      }
    } catch (err) {
      return error(_module, `${_submodule}:unregisterAction`, null, err);
    }
  }

  /**
   * Invokes an action.
   * @param {string} name Name of the action
   * @returns {void}
   */
  async invoke (name) {
    return this.actions.find(r => r.action === name).executor();
  }
}
