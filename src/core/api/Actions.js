/**
 * The actions API is meant for registering quick actions that may be
 * useful for other plugins, or just have the ability to call on the fly.
 * @module Actions
 * @memberof API
 * @namespace API.Actions
 * @version 1.0.0
 */

/**
 * Vizality action object.
 * @typedef VizalityAction
 * @property {string} id Action ID
 * @property {Function} executor Action executor
 * @property {string} caller Addon ID of action registrar. This property is set automatically.
 */

import Constants from '@vizality/constants';
import Entities from '@vizality/entities';
import Util from '@vizality/util';

/**
 * All currently registered actions.
 * Accessed with `getAllActions` below.
 */
let actions = [];

/**
 * @extends Entities.API
 * @extends Events
 */
export default class Actions extends Entities.API {
  /**
   * Shuts down the API, removing all listeners and stored objects.
   */
  stop () {
    try {
      this.unregisterAllActions();
      delete vizality.api.actions;
      this.removeAllListeners();
    } catch (err) {
      return this.error('There was an error unloading the Actions API!', err);
    }
  }

  /**
   * Registers an action.
   * @param {string} actionId Action ID
   * @param {Function} executor Action executor
   * @emits Actions#Constants.Events.VIZALITY_ACTION_ADD
   */
  registerAction (actionId, executor) {
    try {
      Util.string.assertString(actionId);
      if (this.isAction(actionId)) {
        throw new Error(`Action "${actionId}" is already registered!`);
      }
      if (!executor) {
        throw new Error('Action must contain an executor!');
      }
      if (typeof executor !== 'function') {
        throw new TypeError('Action executor must be a function!');
      }
      const caller = Util.file.getCaller();
      actions.push({
        id: actionId,
        executor,
        caller
      });
      this.emit(Constants.Events.VIZALITY_ACTION_ADD, actionId);
    } catch (err) {
      return this.error(this._labels.concat('registerAction'), err);
    }
  }

  /**
   * Invokes an action executor.
   * @param {string} actionId Action ID
   */
  async invokeAction (actionId) {
    try {
      Util.string.assertString(actionId);
      if (!this.isAction(actionId)) {
        throw new Error(`Action "${actionId}" could not be found!`);
      }
      try {
        await this.getActionById(actionId).executor();
      } catch (err) {
        return this.error(this._labels.concat('invokeAction'), `There was a problem invoking action "${actionId}" executor!`, err);
      }
    } catch (err) {
      return this.error(this._labels.concat('invokeAction'), err);
    }
  }

  /**
   * Checks if an action is registered.
   * @param {string} actionId Action ID
   */
  isAction (actionId) {
    try {
      Util.string.assertString(actionId);
      return Boolean(this.getActionById(actionId));
    } catch (err) {
      return this.error(this._labels.concat('isAction'), err);
    }
  }

  /**
   * Gets the first action found matching a given filter.
   * @param {Function} filter Function to use to filter actions by
   * @returns {Object|null} Action matching a given filter
   */
  getAction (filter) {
    try {
      if (!filter?.length) return null;
      return actions.find(filter);
    } catch (err) {
      return this.error(this._labels.concat('getAction'), err);
    }
  }

  /**
   * Gets an action matching a given ID.
   * @param {string} actionId Action ID
   * @returns {Object|null} Action matching a given ID
   */
  getActionById (actionId) {
    try {
      Util.string.assertString(actionId);
      return actions.find(action => action.id === actionId);
    } catch (err) {
      return this.error(this._labels.concat('getActionById'), err);
    }
  }

  /**
   * Gets all actions found matching a given filter.
   * @param {Function} filter Function to use to filter actions by
   * @returns {Array<Object|null>} Actions matching a given filter
   */
  getActions (filter) {
    try {
      if (!filter?.length) return null;
      return actions.filter(filter);
    } catch (err) {
      return this.error(this._labels.concat('getActions'), err);
    }
  }

  /**
   * Gets all actions matching a given caller.
   * @param {string} addonId Addon ID
   * @returns {Array<Object|null>} Actions matching a given caller
   */
  getActionsByCaller (addonId) {
    try {
      Util.string.assertString(addonId);
      return actions.filter(action => action.caller === addonId);
    } catch (err) {
      return this.error(this._labels.concat('getActionsByCaller'), err);
    }
  }

  /**
   * Gets all actions.
   * @returns {Array<Object|null>} All actions
   */
  getAllActions () {
    try {
      return actions;
    } catch (err) {
      return this.error(this._labels.concat('getAllActions'), err);
    }
  }

  /**
   * Unregisters an action.
   * @param {string} actionId Action ID
   * @emits Actions#Constants.Events.VIZALITY_ACTION_REMOVE
   */
  unregisterAction (actionId) {
    try {
      Util.string.assertString(actionId);
      if (this.isAction(actionId)) {
        actions = this.getActions(action => action.id !== actionId);
        this.emit(Constants.Events.VIZALITY_ACTION_REMOVE, actionId);
      } else {
        throw new Error(`Action "${actionId}" is not registered, so it cannot be unregistered!`);
      }
    } catch (err) {
      return this.error(this._labels.concat('unregisterAction'), err);
    }
  }

  /**
   * Unregisters all actions matching a given caller.
   * @param {string} addonId Addon ID
   * @emits Actions#Constants.Events.VIZALITY_ACTION_REMOVE_ALL_BY_CALLER
   */
  unregisterActionsByCaller (addonId) {
    try {
      Util.string.assertString(addonId);
      actions = actions.filter(action => action.caller !== addonId);
      this.emit(Constants.Events.VIZALITY_ACTION_REMOVE_ALL_BY_CALLER, addonId);
    } catch (err) {
      return this.error(this._labels.concat('unregisterActionsByCaller'), err);
    }
  }

  /**
   * Unregisters all actions.
   * @emits Actions#Constants.Events.VIZALITY_ACTION_REMOVE_ALL
   */
  unregisterAllActions () {
    try {
      actions = [];
      this.emit(Constants.Events.VIZALITY_ACTION_REMOVE_ALL);
    } catch (err) {
      return this.error(this._labels.concat('unregisterAllActions'), err);
    }
  }
}
