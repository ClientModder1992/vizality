const { logger: { log, error } } = require('@util');

const Events = require('events');

class API extends Events {
  constructor () {
    super();
    this.MODULE = 'API';
    this.SUBMODULE = this.constructor.name;
    this.ready = false;
  }

  async _load () {
    try {
      if (typeof this.startAPI === 'function') {
        await this.startAPI();
      }
      log(this.MODULE, this.SUBMODULE, null, 'API loaded.');
      this.ready = true;
    } catch (e) {
      error(this.MODULE, this.SUBMODULE, null, 'An error occurred during initialization!', e);
    }
  }

  async _unload () {
    try {
      if (typeof this.apiWillUnload === 'function') {
        await this.apiWillUnload();
      }
      this.ready = false;
      log(this.MODULE, this.SUBMODULE, null, 'Plugin unloaded.');
    } catch (e) {
      error(this.MODULE, this.SUBMODULE, null,
        'An error occurred during shutting down! It\'s heavily recommended to reload Discord to ensure there is no conflicts.', e
      );
    }
  }
}

module.exports = API;
