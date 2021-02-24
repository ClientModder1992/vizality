import { log, warn, error } from '@vizality/util/logger';

import Events from 'events';

export default class API extends Events {
  constructor () {
    super();
    this._labels = [ 'API', this.constructor.name ];
    this._ready = false;
  }

  log (...message) { log({ labels: this._labels, message }); }
  warn (...message) { warn({ labels: this._labels, message }); }
  error (...message) { error({ labels: this._labels, message }); }

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
