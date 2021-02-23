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

  async _load (suppress = false) {
    try {
      if (typeof this.start === 'function') {
        await this.start();
      }

      if (!suppress) {
        this.log('API loaded.');
      }
    } catch (err) {
      this.error('An error occurred during initialization!', err);
    }

    this._ready = true;
  }

  async _unload (suppress = false) {
    try {
      if (typeof this.stop === 'function') {
        await this.stop();
      }

      if (!suppress) {
        this.log(this._module, this._submodule, null, 'API unloaded.');
      }
    } catch (err) {
      this.error(`An error occurred during shutting down! It's recommended to reload Discord to ensure there are no conflicts.`, err);
    } finally {
      this._ready = false;
    }
  }
}
