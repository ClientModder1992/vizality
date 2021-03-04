import { log, warn, error } from '@vizality/util/logger';
import { isArray } from '@vizality/util/array';
import Events from 'events';

/**
 * @todo Finish writing this.
 * Main class for Vizality APIs.
 * @extends Events
 */
export default class API extends Events {
  constructor () {
    super();
    this._labels = [ 'API', this.constructor.name ];
    this._ready = false;
  }

  log (...message) {
    // In case the API wants to provide their own labels
    if (isArray(message[0])) {
      const _message = message.slice(1);
      log({ labels: message[0], message: _message });
    } else {
      log({ labels: this._labels, message });
    }
  }

  warn (...message) {
    // In case the API wants to provide their own labels
    if (isArray(message[0])) {
      const _message = message.slice(1);
      warn({ labels: message[0], message: _message });
    } else {
      warn({ labels: this._labels, message });
    }
  }

  error (...message) {
    // In case the API wants to provide their own labels
    if (isArray(message[0])) {
      const _message = message.slice(1);
      error({ labels: message[0], message: _message });
    } else {
      error({ labels: this._labels, message });
    }
  }

  /**
   * Loads the API.
   * @param {boolean} [showLogs=true] Whether to show startup console logs
   * @private
   */
  async _load (showLogs = true) {
    try {
      if (typeof this.start === 'function') {
        await this.start();
      }
      if (showLogs) {
        this.log('API loaded.');
      }
      this._ready = true;
    } catch (err) {
      this.error('An error occurred during initialization!', err);
    }
  }

  /**
   * Unloads the API.
   * @param {boolean} [showLogs=true] Whether to show shutdown console logs
   * @private
   */
  async _unload (showLogs = true) {
    try {
      if (typeof this.stop === 'function') {
        await this.stop();
      }
      if (showLogs) {
        this.log('API unloaded.');
      }
    } catch (err) {
      this.error(`An error occurred while shutting down! It's recommended to reload Discord to ensure there are no conflicts.`, err);
    } finally {
      this._ready = false;
    }
  }
}
