import { log, warn, error } from '@vizality/util/logger';

import Events from 'events';

export default class API extends Events {
  constructor () {
    super();
    this._module = 'API';
    this._submodule = this.constructor.name;
    this._ready = false;
  }

  log (...message) { log({ module: this._module, submodule: this._submodule, message }); }
  warn (...message) { warn({ module: this._module, submodule: this._submodule, message }); }
  error (...message) { error({ module: this._module, submodule: this._submodule, message }); }

  async _load (showLogs = true) {
    try {
      if (typeof this.start === 'function') {
        await this.start();
      }

      if (showLogs) {
        this.log('API loaded.');
      }
    } catch (err) {
      this.error('An error occurred during initialization!', err);
    }

    this._ready = true;
  }

  async _unload (showLogs = true) {
    try {
      if (typeof this.stop === 'function') {
        await this.stop();
      }

      if (showLogs) {
        this.log(this._module, this._submodule, null, 'API unloaded.');
      }
    } catch (err) {
      this.error(`An error occurred during shutting down! It's recommended to reload Discord to ensure there are no conflicts.`, err);
    } finally {
      this._ready = false;
    }
  }
}
