import { log, error } from '@vizality/util/logger';

import Events from 'events';

export default class API extends Events {
  constructor () {
    super();
    this._module = 'API';
    this._submodule = this.constructor.name;
    this._ready = false;
  }

  async _load () {
    try {
      if (typeof this.onStart === 'function') {
        await this.onStart();
      }
      this._ready = true;
      log(this._module, this._submodule, null, 'API loaded.');
    } catch (err) {
      error(this._module, this._submodule, null, 'An error occurred during initialization!', err);
    }
  }

  async _unload () {
    try {
      if (typeof this.onStop === 'function') {
        await this.onStop();
      }
      this._ready = false;
      log(this._module, this._submodule, null, 'API unloaded.');
    } catch (err) {
      error(this._module, this._submodule, null,
        'An error occurred during shutting down! It\'s heavily recommended to reload Discord to ensure there is no conflicts.', err
      );
    }
  }
}
