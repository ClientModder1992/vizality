import { log, error } from '@vizality/util/logger';

import Events from 'events';

export default class API extends Events {
  constructor () {
    super();
    this._module = 'API';
    this._submodule = this.constructor.name;
    this._ready = false;
  }

  async _load (showLogs = true) {
    try {
      if (typeof this.start === 'function') {
        await this.start();
      }

      if (showLogs) {
        log(this._module, this._submodule, null, 'API loaded.');
      }
    } catch (err) {
      error(this._module, this._submodule, null, 'An error occurred during initialization!', err);
    }

    this._ready = true;
  }

  async _unload (showLogs = true) {
    try {
      if (typeof this.stop === 'function') {
        await this.stop();
      }

      if (showLogs) {
        log(this._module, this._submodule, null, 'API unloaded.');
      }
    } catch (err) {
      error(this._module, this._submodule, null,
        `An error occurred during shutting down! It's recommended to reload Discord to ensure there are no conflicts.`, err
      );
    } finally {
      this._ready = false;
    }
  }
}
