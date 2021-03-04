/**
 * The notices API is meant for sending any type of popup notice, ranging from modals
 * (also known as dialogs) to toasts (also known as notifications) and announcements (also
 * known as notices).
 * @module Notices
 * @memberof API
 * @namespace API.Notices
 * @version 1.0.0
 */

import React from 'react';
import { toast } from 'react-toastify';

import { API } from '@vizality/entities';

/*
 * @todo
 * Add showAlert, showPrompt, showConfirm, showModal (type property: alert, prompt, confirm)
 * Add closeAlert, closePrompt, closeConfirm, closeModal, closeAllAlerts, closeAllPrompts,
 * closeAllConfirms, closeAllModals, closeAllAnnouncements, closeAllToasts, closeAllNotices
 */

/**
 * @typedef VizalityToast
 * @property {string} header
 * @property {string} content
 * @property {Array<ToastButton>} [buttons]
 * @property {number} [timeout]
 * @property {string} [className]
 * @property {boolean} [hideProgressBar]
 */

/**
 * @typedef ToastButton
 * @property {string|void} [size]
 * @property {string|void} [look]
 * @property {string|void} [color]
 * @property {Function} onClick
 * @property {string} text
 */

/**
 * @typedef VizalityAnnouncement
 * @property {string} message
 * @property {string|void} color
 * @property {Function|void} onClose
 * @property {Object} [button]
 * @property {Function} button.onClick
 * @property {string} button.text
 */

/**
 * @property {object.<string, VizalityToast>} toasts
 * @property {object.<string, VizalityAnnouncement>} announcements
 */

const notices = {
  announcements: [],
  confirms: [],
  prompts: [],
  alerts: [],
  modals: [],
  toasts: []
};

/**
 * @extends API
 * @extends Events
 */
export default class Notices extends API {
  constructor () {
    super();
    this.notices = {
      announcements: [],
      confirms: [],
      prompts: [],
      alerts: [],
      modals: [],
      toasts: []
    };
    this._labels = [ 'API', 'Notices' ];
  }

  /**
   * Shuts down the API, removing all listeners and stored objects.
   */
  stop () {
    delete vizality.api.notices;
    this.removeAllListeners();
  }

  /**
   * Sends an announcement to the user (banner at the top of the client).
   *
   * @param {string} id - Announcement ID
   * @param {VizalityAnnouncement} props - Announcement
   * @fires NoticesAPI#announcementAdded
   * @returns {VizalityAnnouncement} Announcement
   */
  sendAnnouncement (id, props) {
    if (this.announcements[id]) {
      return this.error(`Announcement ID "${id}" is already used by another plugin!`);
    }

    this.announcements[id] = props;
    this.emit('announcementAdded', id);
  }

  /**
   * Closes an announcement.
   *
   * @param {string} id - Announcement ID
   * @fires NoticesAPI#announcementClosed
   */
  closeAnnouncement (id) {
    if (!this.announcements[id]) {
      return;
    }

    delete this.announcements[id];
    this.emit('announcementClosed', id);
  }

  /**
   * Sends a toast to the user.
   *
   * @param {string} id - Toast ID
   * @param {VizalityToast} props - Toast
   * @fires NoticesAPI#toastAdded
   * @returns {VizalityToast} Toast
   */
  sendToast () {
    return void 0;
    // Do nothing if toast notifications are disabled
    if (!vizality.settings.get('toastNotifications', true)) return;
    const addon = vizality.manager.plugins.get('example-plugin-settings');
    const Settings = addon.sections.settings.render;
    return toast(<Settings />);
    if (this.toasts[id]) {
      return this.error(`ID ${id} is already used by another plugin!`);
    }

    this.toasts[id] = props;
    this.emit('toastAdded', id);
  }

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
