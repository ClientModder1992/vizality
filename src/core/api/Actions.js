/**
 * The actions API is meant for registering quick actions that may be
 * useful for other plugins, or just have the ability to call on the fly.
 * @module Actions
 * @memberof API
 * @namespace API.Actions
 * @version 1.0.0
 */

import { assertObject } from '@vizality/util/object';
import { assertString } from '@vizality/util/string';
import { getCaller } from '@vizality/util/file';
import { Events } from '@vizality/constants';
import { API } from '@vizality/entities';

let actions = [];

/**
 * @typedef VizalityAction
 * @property {string} action Action name
 * @property {Function} executor Action executor
 * @property {string} caller Addon ID of action registrar. This property is set automatically.
 */

/**
 * @extends API
 * @extends Events
 */
export default class Actions extends API {
  constructor () {
    super();
    this._labels = [ 'API', 'Actions' ];
  }

  /**
   * Shuts down the API, removing all listeners and stored objects.
   */
  stop () {
    try {
      delete vizality.api.actions;
      this.removeAllListeners();
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Registers an action.
   * @param {VizalityAction} action Action to register
   * @emits Actions#Events.VIZALITY_ACTION_ADD
   */
  registerAction (action) {
    try {
      assertObject(action);
      assertString(action.action);
      const caller = getCaller();
      if (this.isAction(action.action)) {
        throw new Error(`Action "${action.action}" is already registered!`);
      }
      if (!action.executor) {
        throw new Error('Action must contain an executor!');
      }
      if (typeof action.executor !== 'function') {
        throw new TypeError('Action executor must be a function!');
      }
      actions.push({
        ...action,
        caller
      });
      this.emit(Events.VIZALITY_ACTION_ADD, action.action);
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Checks if an action is registered.
   * @param {string} actionName Action name
   */
  isAction (actionName) {
    try {
      return Boolean(this.getActionByName(actionName));
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Unregisters an action.
   * @param {string} actionName Action name
   * @emits Actions#Events.VIZALITY_ACTION_REMOVE
   */
  unregisterAction (actionName) {
    try {
      if (this.isAction(actionName)) {
        actions = this.getActions(action => action.action !== actionName);
        this.emit(Events.VIZALITY_ACTION_REMOVE, actionName);
      } else {
        throw new Error(`Action "${actionName}" is not registered, so it cannot be unregistered!`);
      }
    } catch (err) {
      return this.error(err);
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
      return this.error(err);
    }
  }

  /**
   * Unregisters all actions matching a given caller.
   * @param {string} addonId Addon ID
   * @emits Actions#Events.VIZALITY_ACTION_REMOVE_ALL_BY_CALLER
   */
  unregisterActionsByCaller (addonId) {
    try {
      actions = actions.filter(action => action.caller !== addonId);
      this.emit(Events.VIZALITY_ACTION_REMOVE_ALL_BY_CALLER, addonId);
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Invokes an action executor.
   * @param {string} actionName Action name
   * @emits Actions#Events.VIZALITY_ACTION_INVOKE
   */
  async invokeAction (actionName) {
    try {
      if (!this.isAction(actionName)) {
        throw new Error(`Action "${actionName}" could not be found!`);
      }
      await this.getActionByName(actionName).executor();
      this.emit(Events.VIZALITY_ACTION_INVOKE, actionName);
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Gets all actions matching a given caller.
   * @param {string} addonId Addon ID
   * @returns {Array<Object|null>} Actions matching the given caller
   */
  getActionsByCaller (addonId) {
    try {
      return actions.filter(action => action.caller === addonId);
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Gets the first action found matching a given filter.
   * @param {Function} filter Function to use to filter actions by
   * @returns {Object|null} Action matching the given filter
   */
  getAction (filter) {
    try {
      return actions.find(filter);
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Gets an action matching a given name.
   * @param {string} actionName Action name
   * @returns {Object|null} Action matching the given name
   */
  getActionByName (actionName) {
    try {
      return actions.find(action => action.action === actionName);
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Gets all actions found matching a given filter.
   * @param {Function} filter Function to use to filter actions by
   * @returns {Array<Object|null>} Actions matching the given filter
   */
  getActions (filter) {
    try {
      return actions.filter(filter);
    } catch (err) {
      return this.error(err);
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
      return this.error(err);
    }
  }
}
