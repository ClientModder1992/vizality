const { logger: { log, error } } = require('@util');

const Events = require('events');

module.exports = class API extends Events {
  constructor () {
    super();
    this._module = 'API';
    this._submodule = this.constructor.name;
    this._ready = false;
  }

  async start () {
    try {
      if (typeof this.onStart === 'function') {
        await this.onStart();
      }
      log(this._module, this._submodule, null, 'API loaded.');
      this._ready = true;
    } catch (err) {
      error(this._module, this._submodule, null, 'An error occurred during initialization!', err);
    }
  }

  async stop () {
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
};
