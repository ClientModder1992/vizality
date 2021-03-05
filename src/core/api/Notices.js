/**
 * The notices API is meant for sending any type of popup notice, ranging from modals
 * (also known as dialogs) to toasts (also known as notifications) and announcements (also
 * known as notices).
 * @module Notices
 * @memberof API
 * @namespace API.Notices
 * @version 1.0.0
 */

/*
 * @todo Add closeAllAnnouncements, closeAllToasts, closeAllNotices
 */

import Constants from '@vizality/constants';
import Entities from '@vizality/entities';
import { toast } from 'react-toastify';
import Util from '@vizality/util';
import React from 'react';

/**
 * @typedef VizalityAnnouncement
 * @property {string} [id]
 * @property {string} message
 * @property {string} [color]
 * @property {Function} [onClose]
 * @property {Object} [button]
 * @property {Function} button.onClick
 * @property {string} button.text
 */

/**
 * @typedef VizalityToast
 * @property {string} [id]
 * @property {string} header
 * @property {string} content
 * @property {Array<ToastButton>} [buttons]
 * @property {number} [timeout]
 * @property {string} [className]
 * @property {boolean} [hideProgressBar]
 */

/**
 * @typedef ToastButton
 * @property {string} [size]
 * @property {string} [look]
 * @property {string} [color]
 * @property {Function} onClick
 * @property {string} text
 */

/**
 * All currently opened notices.
 * Accessed with `getAllAnnouncements` and `getAllToasts` below.
 */
let notices = {
  announcements: [],
  toasts: []
};

/**
 * @extends Entities.API
 * @extends Events
 */
export default class Notices extends Entities.API {
  /**
   * Shuts down the API, removing all listeners and stored objects.
   */
  stop () {
    try {
      this.closeAllAnnouncements();
      this.closeAllToasts();
      delete vizality.api.notices;
      this.removeAllListeners();
    } catch (err) {
      return this.error('There was an error unloading the Notices API!', err);
    }
  }

  /**
   * Sends an announcement (in the form of a banner at the top of the client).
   * @param {VizalityAnnouncement} announcement Announcement to send
   * @emits Notices#Constants.Events.VIZALITY_ANNOUNCEMENT_SEND
   */
  sendAnnouncement (announcement) {
    try {
      Util.object.assertObject(announcement);
      Util.string.assertString(announcement.message);
      announcement.caller = Util.file.getCaller();
      announcement.id = announcement.id || `${Util.string.toSnakeCase(announcement.caller).toUpperCase()}_ANNOUNCEMENT_${this.getKeybindsByCaller(announcement.caller)?.length + 1 || '1'}`;
      Util.string.assertString(announcement.id);
      if (this.isAnnouncement(announcement.id)) {
        throw new Error(`Announcement "${announcement.id}" is already active!`);
      }
      if (!announcement.executor) {
        throw new Error('Command must contain an executor!');
      }
      if (announcement.onClose && typeof announcement.onClose !== 'function') {
        throw new TypeError('Announcement onClose property value must be a function!');
      }
      if (announcement.color) {
        Util.string.assertString(announcement.color);
      }
      if (announcement.button) {
        Util.object.assertObject(announcement.button);
        if (announcement.button.onClose && typeof announcement.onClose !== 'function') {
          throw new TypeError('Announcement button onClose property value must be a function!');
        }
        if (announcement.button.text) {
          Util.string.assertString(announcement.button.text);
        }
      }
      notices.announcements.push(announcement);
      this.emit(Constants.Events.VIZALITY_ANNOUNCEMENT_ADD, announcement.id);
    } catch (err) {
      return this.error(this._labels.concat('sendAnnouncement'), err);
    }
  }

  /**
   * Sends a toast notification.
   * @param {VizalityToast} toast Toast to send
   * @emits Notices#Constants.Events.VIZALITY_TOAST_SEND
   */
  sendToast (toast) {
    try {
      if (Util.react.isComponent(toast)) {
        console.log('pie');
      } else {
        Util.object.assertObject(toast);
      }
      return;
      Util.object.assertObject(toast);
      Util.string.assertString(announcement.message);
      announcement.caller = Util.file.getCaller();
      announcement.id = announcement.id || `${Util.string.toSnakeCase(announcement.caller).toUpperCase()}_ANNOUNCEMENT_${this.getKeybindsByCaller(announcement.caller)?.length + 1 || '1'}`;
      Util.string.assertString(announcement.id);
      if (this.isAnnouncement(announcement.id)) {
        throw new Error(`Announcement "${announcement.id}" is already active!`);
      }
      if (!announcement.executor) {
        throw new Error('Command must contain an executor!');
      }
      if (announcement.onClose && typeof announcement.onClose !== 'function') {
        throw new TypeError('Announcement onClose property value must be a function!');
      }
      if (announcement.color) {
        Util.string.assertString(announcement.color);
      }
      if (announcement.button) {
        Util.object.assertObject(announcement.button);
        if (announcement.button.onClose && typeof announcement.onClose !== 'function') {
          throw new TypeError('Announcement button onClose property value must be a function!');
        }
        if (announcement.button.text) {
          Util.string.assertString(announcement.button.text);
        }
      }
      notices.announcements.push(announcement);
      this.emit(Constants.Events.VIZALITY_ANNOUNCEMENT_ADD, announcement.id);
    } catch (err) {
      return this.error(this._labels.concat('sendAnnouncement'), err);
    }
  }

  /**
   * Closes an announcement.
   * @param {string} announcementId Announcement ID
   * @emits Notices#Constants.Events.VIZALITY_ANNOUNCEMENT_CLOSE
   */
  closeAnnouncement (announcementId) {
    try {
      Util.string.assertString(announcementId);
      notices.announcements = this.getAnnouncements(announcement => announcement.id !== announcementId);
      this.emit(Constants.Events.VIZALITY_ANNOUNCEMENT_CLOSE, announcementId);
    } catch (err) {
      return this.error(this._labels.concat('closeAnnouncement'), err);
    }
  }

  /**
   * Closes a toast.
   * @param {string} toastId Toast ID
   * @emits Notices#Constants.Events.VIZALITY_TOAST_CLOSE
   */
  closeToast (toastId) {
    try {
      Util.string.assertString(toastId);
      const toast = this.getToast(toastId);
      notices.toasts = this.getToasts(toast => toast.id !== toastId);
      if (toast?.callback && typeof toast.callback === 'function') {
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
   * Sends a toast to the user.
   *
   * @param {string} id - Toast ID
   * @param {VizalityToast} props - Toast
   * @fires NoticesAPI#toastAdded
   * @returns {VizalityToast} Toast
   */
  // sendToast () {
  //   return void 0;
  //   // Do nothing if toast notifications are disabled
  //   if (!vizality.settings.get('toastNotifications', true)) return;
  //   const addon = vizality.manager.plugins.get('example-plugin-settings');
  //   const Settings = addon.sections.settings.render;
  //   return toast(<Settings />);
  //   if (this.toasts[id]) {
  //     return this.error(`ID ${id} is already used by another plugin!`);
  //   }

  //   this.toasts[id] = props;
  //   this.emit('toastAdded', id);
  // }

  /**
   * Closes a toast.
   *
   * @param {string} id - Toast ID
   * @fires NoticesAPI#toastClosing
   */
  closeToast (id) {
    const toast = this.toasts[id];
    if (!toast) {
      return;
    }

    if (toast.callback && typeof toast.callback === 'function') {
      toast.callback();
    }

    this.emit('toastClosing', id);
    setTimeout(() => delete this.toasts[id], 500);
  }
}
