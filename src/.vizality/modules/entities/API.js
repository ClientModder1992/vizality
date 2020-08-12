const { logger: { log, error } } = require('@utilities');

const Events = require('events');

class API extends Events {
  constructor () {
    super();
    
    this._module = 'API';
    this._submodule = this.constructor.name;
    this._ready = false;
  }

  async _load () {
    try {
      if (typeof this.loadAPI === 'function') {
        await this.loadAPI();
      }
      log(this._module, this._submodule, null, 'API loaded.');
      this._ready = true;
    } catch (e) {
      error(this._module, this._submodule, null, 'An error occurred during initialization!', e);
    }
  }

  async _unload () {
    try {
      if (typeof this.unloadAPI === 'function') {
        await this.unloadAPI();
      }
      this._ready = false;
      log(this._module, this._submodule, null, 'API unloaded.');
    } catch (e) {
      error(this._module, this._submodule, null,
        'An error occurred during shutting down! It\'s heavily recommended to reload Discord to ensure there is no conflicts.', e
      );
    }
  }
}

module.exports = API;
