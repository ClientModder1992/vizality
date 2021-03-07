/**
 * The notifications API is meant for sending various types of notifications, including toasts
 * and notices.
 * @module Notifications
 * @memberof API
 * @namespace API.Notifications
 * @version 1.0.0
 */

/**
 * Vizality notice object.
 * @typedef VizalityNotice
 * @property {string} [id] Notice ID
 * @property {string} message Notice message
 * @property {string} [color='blurple'] Notice background color
 * @property {Function} [callback] Callback function triggered when the notice closes
 * @property {Array<NoticeButton>} [buttons] Notice buttons
 * @property {string} caller Addon ID of notice sender. This property is set automatically.
 */

/**
 * Vizality notice button.
 * @typedef NoticeButton
 * @property {Function} onClick Button on click executor
 * @property {string} text Button text
 */

/**
 * Vizality toast object.
 * @typedef VizalityToast
 * @property {string} [id] Toast ID
 * @property {number|boolean} [autoClose] Either the duration in milliseconds until the toast auto-closes, or a boolean of whether it should auto-close. This overrides the default user setting on a per-toast basis.
 * @property {string|ReactElement} header Toast header
 * @property {string|ReactElement} [content] Toast content
 * @property {Array<ToastButton>} [buttons] Toast buttons
 * @property {number} [timeout] Time until the toast auto-closes (in milliseconds)
 * @property {number} [delay] Delay toast appearing (in milliseconds)
 * @property {Function} [callback] Callback function triggered when the toast closes
 * @property {string} caller Addon ID of toast sender. This property is set automatically.
 */

/**
 * Vizality toast button.
 * @typedef ToastButton
 * @property {string} [size='small'] Button size
 * @property {string} [look='filled'] Button appearance
 * @property {string} [color='brand'] Button color
 * @property {Function} onClick Button on click executor
 * @property {string} text Button text
 */

import { toast as _toast } from 'react-toastify';
import Constants from '@vizality/constants';
import Entities from '@vizality/entities';
import Webpack from '@vizality/webpack';
import Util from '@vizality/util';
import React from 'react';

/**
 * All currently opened notifications.
 */
const notifications = {
  // Accessed with `getAllNotices`
  notices: [],
  // Accessed with `getAllToasts`
  toasts: []
};

/**
 * @extends Entities.API
 * @extends Events
 */
export default class Notifications extends Entities.API {
  /**
   * Shuts down the API, removing all listeners and stored objects.
   */
  stop () {
    try {
      this.closeAllNotices();
      this.closeAllToasts();
      delete vizality.api.notifications;
      this.removeAllListeners();
    } catch (err) {
      return this.error('There was an error unloading the Notifications API!', err);
    }
  }

  /**
   * Sends a notice (in the form of a banner at the top of the client).
   * @param {VizalityNotice} notice Notice to send
   * @emits Notifications#Constants.Events.VIZALITY_NOTICE_SEND
   */
  sendNotice (notice) {
    try {
      Util.object.assertObject(notice);
      Util.string.assertString(notice.message);
      notice.caller = Util.file.getCaller();
      notice.id = notice.id || `${Util.string.toSnakeCase(notice.caller).toUpperCase()}_NOTICE_${this.getNoticesByCaller(notice.caller)?.length + 1 || '1'}`;
      Util.string.assertString(notice.id);
      if (this.isNotice(notice.id)) {
        throw new Error(`Notice "${notice.id}" is already active!`);
      }
      if (notice.callback && typeof notice.callback !== 'function') {
        throw new TypeError('Notice "callback" property value must be a function!');
      }
      if (notice.color) {
        Util.string.assertString(notice.color);
      }
      if (notice.buttons) {
        Util.array.assertArray(notice.buttons);
        notice.buttons.forEach(button => {
          if (typeof button.onClick !== 'function') {
            throw new TypeError('Notice button "onClick" property value must be a function!');
          }
          if (!button.text || !Util.string.isString(button.text)) {
            throw new TypeError('Toast button "text" property value must be a string!');
          }
        });
      }
      notifications.notices.push(notice);
      this.emit(Constants.Events.VIZALITY_NOTICE_SEND, notice.id);
    } catch (err) {
      return this.error(this._labels.concat('sendNotice'), err);
    }
  }

  /**
   * Sends a toast notification.
   * @param {VizalityToast|ReactElement} toast Toast to send
   * @emits Notifications#Constants.Events.VIZALITY_TOAST_SEND
   */
  sendToast (toast) {
    try {
      if (!Util.react.isComponent(toast) && !Util.object.isObject(toast)) {
        throw new Error('Toast must be either a React component or an object!');
      }
      if (Util.react.isComponent(toast) || React.isValidElement(toast)) {
        const component = toast;
        toast = {};
        toast.custom = component;
      }
      Util.object.assertObject(toast);
      if (toast.callback && typeof toast.callback !== 'function') {
        throw new TypeError('Toast "callback" property value must be a function!');
      }
      if (toast.delay) {
        Util.number.assertNumber(toast.delay);
      }
      if (toast.buttons) {
        Util.array.assertArray(toast.buttons);
        toast.buttons.forEach(button => {
          if (typeof button.onClick !== 'function') {
            throw new TypeError('Toast button "onClick" property value must be a function!');
          }
          if (!button.text || !Util.string.isString(button.text)) {
            throw new TypeError('Toast button "text" property value must be a string!');
          }
          if (button.size) Util.string.assertString(button.size);
          if (button.look) Util.string.assertString(button.look);
          if (button.color) Util.string.assertString(button.color);
        });
      }
      if (toast.autoClose && (!Util.number.isNumber(toast.autoClose) || typeof toast.autoClose !== 'boolean')) {
        throw new TypeError('Toast "autoClose" property value must be a number or boolean!');
      }
      toast.caller = Util.file.getCaller();
      toast.id = toast.id || `${Util.string.toSnakeCase(toast.caller).toUpperCase()}_TOAST_${this.getToastsByCaller(toast.caller)?.length + 1 || '1'}`;
      Util.string.assertString(toast.id);
      notifications.toasts.push(toast);
      this.emit(Constants.Events.VIZALITY_TOAST_SEND, toast.id);
    } catch (err) {
      return this.error(this._labels.concat('sendToast'), err);
    }
  }

  /**
   * Checks if a notice is active.
   * @param {string} noticeId Notice ID
   * @returns {boolean} Whether a notice with a given ID is active
   */
  isNotice (noticeId) {
    try {
      Util.string.assertString(noticeId);
      return Boolean(this.getNoticeById(noticeId));
    } catch (err) {
      return this.error(this._labels.concat('isNotice'), err);
    }
  }

  /**
   * Checks if a toast is currently active.
   * @param {string} toastId Toast ID
   * @returns {boolean} Whether a toast with a given ID is active
   */
  isToastActive (toastId) {
    try {
      Util.string.assertString(toastId);
      return Boolean(_toast.isActive(toastId));
    } catch (err) {
      return this.error(this._labels.concat('isToast'), err);
    }
  }

  /**
   * Checks if a toast is in queue to be sent.
   * @param {string} toastId Toast ID
   * @returns {boolean} Whether a toast with a given ID is queued
   */
  isToastQueued (toastId) {
    try {
      Util.string.assertString(toastId);
      return Boolean(this.isToast(toastId) && !this.isToastActive(toastId));
    } catch (err) {
      return this.error(this._labels.concat('isToast'), err);
    }
  }

  /**
   * Checks if a toast is currently active or is in queue to be sent.
   * @param {string} toastId Toast ID
   * @returns {boolean} Whether a toast with a given ID is active or queued
   */
  isToast (toastId) {
    try {
      Util.string.assertString(toastId);
      return Boolean(this.getToastById(toastId));
    } catch (err) {
      return this.error(this._labels.concat('isToast'), err);
    }
  }

  /**
   * Gets the first notice found matching a given filter.
   * @param {Function} filter Function to use to filter notices by
   * @returns {Object|null} Notice matching a given filter
   */
  getNotice (filter) {
    try {
      if (!filter?.length) return null;
      return notifications.notices.find(filter);
    } catch (err) {
      return this.error(this._labels.concat('getNotice'), err);
    }
  }

  /**
   * Gets the first toast found matching a given filter.
   * @param {Function} filter Function to use to filter toasts by
   * @returns {Object|null} Toast matching a given filter
   */
  getToast (filter) {
    try {
      if (!filter?.length) return null;
      return notifications.toasts.find(filter);
    } catch (err) {
      return this.error(this._labels.concat('getToast'), err);
    }
  }

  /**
   * Gets a notice matching a given ID.
   * @param {string} noticeId Notice ID
   * @returns {Object|null} Notice matching a given ID
   */
  getNoticeById (noticeId) {
    try {
      Util.string.assertString(noticeId);
      return notifications.notices.find(notice => notice.id === noticeId);
    } catch (err) {
      return this.error(this._labels.concat('getNoticeById'), err);
    }
  }

  /**
   * Gets a toast matching a given ID.
   * @param {string} toastId Toast ID
   * @returns {Object|null} Toast matching a given ID
   */
  getToastById (toastId) {
    try {
      Util.string.assertString(toastId);
      return notifications.toasts.find(toast => toast.id === toastId);
    } catch (err) {
      return this.error(this._labels.concat('getToastById'), err);
    }
  }

  /**
   * Gets all notices found matching a given filter.
   * @param {Function} filter Function to use to filter notices by
   * @returns {Array<Object|null>} Notices matching a given filter
   */
  getNotices (filter) {
    try {
      if (!filter?.length) return null;
      return notifications.notices.filter(filter);
    } catch (err) {
      return this.error(this._labels.concat('getNotices'), err);
    }
  }

  /**
   * Gets all toasts found matching a given filter.
   * @param {Function} filter Function to use to filter toasts by
   * @returns {Array<Object|null>} Toasts matching a given filter
   */
  getToasts (filter) {
    try {
      if (!filter?.length) return null;
      return notifications.toasts.filter(filter);
    } catch (err) {
      return this.error(this._labels.concat('getToasts'), err);
    }
  }

  /**
   * Gets all notices matching a given caller.
   * @param {string} addonId Addon ID
   * @returns {Array<Object|null>} Notices matching a given caller
   */
  getNoticesByCaller (addonId) {
    try {
      Util.string.assertString(addonId);
      return notifications.notices.filter(notice => notice.caller === addonId);
    } catch (err) {
      return this.error(this._labels.concat('getNoticesByCaller'), err);
    }
  }

  /**
   * Gets all toasts matching a given caller.
   * @param {string} addonId Addon ID
   * @returns {Array<Object|null>} Toasts matching a given caller
   */
  getToastsByCaller (addonId) {
    try {
      Util.string.assertString(addonId);
      return notifications.toasts.filter(toast => toast.caller === addonId);
    } catch (err) {
      return this.error(this._labels.concat('getToastsByCaller'), err);
    }
  }

  /**
   * Gets all notices.
   * @returns {Array<Object|null>} All notices
   */
  getAllNotices () {
    try {
      return notifications.notices;
    } catch (err) {
      return this.error(this._labels.concat('getAllNotices'), err);
    }
  }

  /**
   * Gets all toasts.
   * @returns {Array<Object|null>} All toasts
   */
  getAllToasts () {
    try {
      return notifications.toasts;
    } catch (err) {
      return this.error(this._labels.concat('getAllToasts'), err);
    }
  }

  /**
   * Gets all active toasts.
   * @returns {Array<Object|null>} All active toasts
   */
  getAllActiveToasts () {
    try {
      const activeToasts = [];
      notifications.toasts.forEach(toast => {
        if (this.isToastActive(toast.id)) {
          activeToasts.push(toast);
        }
      });
      return activeToasts;
    } catch (err) {
      return this.error(this._labels.concat('getAllActiveToasts'), err);
    }
  }

  /**
   * Gets all queued toasts.
   * @returns {Array<Object|null>} All queued toasts
   */
  getAllQueuedToasts () {
    try {
      const queuedToasts = [];
      notifications.toasts.forEach(toast => {
        if (this.isToastQueued(toast.id)) {
          queuedToasts.push(toast);
        }
      });
      return queuedToasts;
    } catch (err) {
      return this.error(this._labels.concat('getAllQueuedToasts'), err);
    }
  }

  /**
   * Closes a notice.
   * @param {string} noticeId Notice ID
   * @emits Notifications#Constants.Events.VIZALITY_NOTICE_CLOSE
   */
  closeNotice (noticeId) {
    try {
      Util.string.assertString(noticeId);
      const notice = this.getNoticeById(noticeId);
      notifications.notices = this.getNotices(notice => notice.id !== noticeId);
      if (typeof notice?.callback === 'function') {
        try {
          notice.callback();
        } catch (err) {
          return this.error(this._labels.concat('closeNotice'), `There was a problem invoking notice "${noticeId}" callback!`, err);
        }
      }
      this.emit(Constants.Events.VIZALITY_NOTICE_CLOSE, noticeId);
    } catch (err) {
      return this.error(this._labels.concat('closeNotice'), err);
    }
  }

  /**
   * Closes a toast.
   * @param {string} toastId Toast ID
   * @emits Notifications#Constants.Events.VIZALITY_TOAST_CLOSE
   */
  closeToast (toastId) {
    try {
      Util.string.assertString(toastId);
      const toast = this.getToastById(toastId);
      if (!toast) return;
      notifications.toasts = this.getToasts(toast => toast.id !== toastId);
      _toast.dismiss(toastId);
      if (typeof toast?.callback === 'function') {
        try {
          toast.callback();
        } catch (err) {
          return this.error(this._labels.concat('closeToast'), `There was a problem invoking toast "${toastId}" callback!`, err);
        }
      }
      this.emit(Constants.Events.VIZALITY_TOAST_CLOSE, toastId);
    } catch (err) {
      return this.error(this._labels.concat('closeToast'), err);
    }
  }

  /**
   * Closes all notices sent by a given caller.
   * @param {string} addonId Addon ID
   * @emits Notifications#Constants.Events.VIZALITY_NOTICE_CLOSE_ALL_BY_CALLER
   */
  closeNoticesByCaller (addonId) {
    try {
      Util.string.assertString(addonId);
      notifications.notices
        .filter(notice => notice.caller === addonId)
        .forEach(notice => this.closeNotice(notice.id));
      this.emit(Constants.Events.VIZALITY_NOTICE_REMOVE_ALL_BY_CALLER, addonId);
    } catch (err) {
      return this.error(this._labels.concat('closeNoticesByCaller'), err);
    }
  }

  /**
   * Closes all toasts sent by a given caller.
   * @param {string} addonId Addon ID
   * @emits Notifications#Constants.Events.VIZALITY_TOAST_CLOSE_ALL_BY_CALLER
   */
  closeToastsByCaller (addonId) {
    try {
      Util.string.assertString(addonId);
      notifications.toasts
        .filter(toast => toast.caller === addonId)
        .forEach(toast => this.closeToast(toast.id));
      this.emit(Constants.Events.VIZALITY_TOAST_REMOVE_ALL_BY_CALLER, addonId);
    } catch (err) {
      return this.error(this._labels.concat('closeToastsByCaller'), err);
    }
  }

  /**
   * Closes all active notices.
   * @emits Notifications#Constants.Events.VIZALITY_NOTICE_CLOSE_ALL
   */
  closeAllNotices () {
    try {
      notifications.notices.forEach(notice => this.closeNotice(notice.id));
      // Dismiss all notices sent by Discord as well
      Webpack.getModule(m => m.default?.dismiss)?.default?.dismiss();
      this.emit(Constants.Events.VIZALITY_NOTICE_CLOSE_ALL);
    } catch (err) {
      return this.error(this._labels.concat('closeAllNotices'), err);
    }
  }

  /**
   * Closes all active (currently visible) toasts. If no toast limit is set, this will be functionally
   * equivalent to the `closeAllToasts` method.
   * @emits Notifications#Constants.Events.VIZALITY_TOAST_CLOSE_ALL_ACTIVE
   */
  closeAllActiveToasts () {
    try {
      notifications.toasts.forEach(toast => {
        if (this.isToastActive(toast.id)) {
          notifications.toasts = this.getToasts(t => t.id !== toast.id);
        }
      });
      _toast.dismiss();
      this.emit(Constants.Events.VIZALITY_TOAST_CLOSE_ALL_ACTIVE);
    } catch (err) {
      return this.error(this._labels.concat('closeAllActiveToasts'), err);
    }
  }

  /**
   * Closes all queued toasts. If no toast limit is set, this method will simply emit
   * an event.
   * @emits Notifications#Constants.Events.VIZALITY_TOAST_CLOSE_ALL_QUEUED
   */
  closeAllQueuedToasts () {
    try {
      notifications.toasts.forEach(toast => {
        if (this.isToastQueued(toast.id)) {
          notifications.toasts = this.getToasts(t => t.id !== toast.id);
        }
      });
      _toast.clearWaitingQueue();
      this.emit(Constants.Events.VIZALITY_TOAST_CLOSE_ALL_QUEUED);
    } catch (err) {
      return this.error(this._labels.concat('closeAllQueuedToasts'), err);
    }
  }

  /**
   * Closes all active toasts.
   * @emits Notifications#Constants.Events.VIZALITY_TOAST_CLOSE_ALL
   */
  closeAllToasts () {
    try {
      _toast.clearWaitingQueue();
      _toast.dismiss();
      notifications.toasts = [];
      this.emit(Constants.Events.VIZALITY_TOAST_CLOSE_ALL);
    } catch (err) {
      return this.error(this._labels.concat('closeAllToasts'), err);
    }
  }
}
