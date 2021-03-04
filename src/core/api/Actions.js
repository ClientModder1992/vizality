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

import { assertString } from '@vizality/util/string';
import { getCaller } from '@vizality/util/file';
import { Events } from '@vizality/constants';
import { API } from '@vizality/entities';

/**
 * All currently registered actions.
 * Accessed with `getAllActions` below.
 */
let actions = [];

/**
 * @extends API
 * @extends Events
 */
export default class Actions extends API {
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
   * @emits Actions#Events.VIZALITY_ACTION_ADD
   */
  registerAction (actionId, executor) {
    try {
      assertString(actionId);
      const caller = getCaller();
      if (this.isAction(actionId)) {
        throw new Error(`Action "${actionId}" is already registered!`);
      }
      if (!executor) {
        throw new Error('Action must contain an executor!');
      }
      if (typeof executor !== 'function') {
        throw new TypeError('Action executor must be a function!');
      }
      actions.push({
        id: actionId,
        executor,
        caller
      });
      this.emit(Events.VIZALITY_ACTION_ADD, actionId);
    } catch (err) {
      return this.error(this._labels.concat('registerAction'), err);
    }
  }

  /**
   * Invokes an action executor.
   * @param {string} actionId Action ID
   * @emits Actions#Events.VIZALITY_ACTION_INVOKE
   */
  async invokeAction (actionId) {
    try {
      assertString(actionId);
      if (!this.isAction(actionId)) {
        throw new Error(`Action "${actionId}" could not be found!`);
      }
      try {
        await this.getActionById(actionId).executor();
      } catch (err) {
        return this.error(err);
      }
      this.emit(Events.VIZALITY_ACTION_INVOKE, actionId);
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
      assertString(actionId);
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
      assertString(actionId);
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
      assertString(addonId);
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
   * @emits Actions#Events.VIZALITY_ACTION_REMOVE
   */
  unregisterAction (actionId) {
    try {
      assertString(actionId);
      if (this.isAction(actionId)) {
        actions = this.getActions(action => action.id !== actionId);
        this.emit(Events.VIZALITY_ACTION_REMOVE, actionId);
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
   * @emits Actions#Events.VIZALITY_ACTION_REMOVE_ALL_BY_CALLER
   */
  unregisterActionsByCaller (addonId) {
    try {
      assertString(addonId);
      actions = actions.filter(action => action.caller !== addonId);
      this.emit(Events.VIZALITY_ACTION_REMOVE_ALL_BY_CALLER, addonId);
    } catch (err) {
      return this.error(this._labels.concat('unregisterActionsByCaller'), err);
    }
  }

  /**
   * Unregisters all actions.
   * @emits Actions#Events.VIZALITY_ACTION_REMOVE_ALL
   */
  unregisterAllActions () {
    try {
      actions = [];
      this.emit(Events.VIZALITY_ACTION_REMOVE_ALL);
    } catch (err) {
      return this.error(this._labels.concat('unregisterAllActions'), err);
    }
  }
}
