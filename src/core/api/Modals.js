/**
 * The modals API allows you to easily open (and close) modals of various types.
 * @module Modals
 * @memberof API
 * @namespace API.Modals
 * @version 1.0.0
 */

/*
 * @todo Add showAlert, showPrompt, showConfirm, showModal (type property: alert, prompt, confirm)
 * Add closeAlert, closePrompt, closeConfirm, closeModal, closeAllAlerts, closeAllPrompts,
 * closeAllConfirms, closeAllModals
 */

import Entities from '@vizality/entities';
import Util from '@vizality/util';

/**
 * All currently active modals.
 * Accessed with `getAllModals` below.
 */
let modals = [];

/**
 * @extends API
 * @extends Events
 */
export default class Modals extends Entities.API {
  /**
   * Shuts down the API, removing all listeners and stored objects.
   */
  stop () {
    try {
      this.unregisterAllModals();
      delete vizality.api.modals;
      this.removeAllListeners();
    } catch (err) {
      return this.error('There was an error unloading the Modals API!', err);
    }
  }
}
