import { API } from '@vizality/entities';

/*
 * @todo:
 * this.error is not a function yet.
 * Add showAlert, showPrompt, showConfirmation.
 * Add closeAlert, closePrompt, closeConfirmation.
 */

/**
 * @typedef VizalityToast
 * @property {string} header
 * @property {string} content
 * @property {ToastButton[]|void} buttons
 * @property {number|void} timeout
 * @property {string|void} className
 * @property {boolean|void} hideProgressBar
 */

/**
 * @typedef ToastButton
 * @property {string|void} size
 * @property {string|void} look
 * @property {string|void} color
 * @property {Function} onClick
 * @property {string} text
 */

/**
 * @typedef VizalityAnnouncement
 * @property {string} message
 * @property {string|void} color
 * @property {Function|void} onClose
 * @property {object|void} button
 * @property {Function} button.onClick
 * @property {string} button.text
 */

/**
 * @property {object.<string, VizalityToast>} toasts
 * @property {object.<string, VizalityAnnouncement>} announcements
 */
export default class Notices extends API {
  constructor () {
    super();
    this.announcements = {};
    this.toasts = {};
    this._module = 'API';
    this._submodule = 'Notices';
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
      return this.error(`ID ${id} is already used by another plugin!`);
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
  sendToast (id, props) {
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

  stop () {
    delete vizality.api.notices;
    this.removeAllListeners();
  }
}
