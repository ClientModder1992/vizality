const { logger: { log, error } } = require('@util');

const Events = require('events');

class API extends Events {
  constructor () {
    super();
    this.module = 'API';
    this.submodule = this.constructor.name;
    this.ready = false;
  }

  async _load () {
    try {
      if (typeof this.startAPI === 'function') {
        await this.startAPI();
      }
      log(this.module, this.submodule, null, 'API loaded.');
      this.ready = true;
    } catch (e) {
      error(this.module, this.submodule, null, 'An error occurred during initialization!', e);
    }
  }

  async _unload () {
    try {
      if (typeof this.apiWillUnload === 'function') {
        await this.apiWillUnload();
      }
      this.ready = false;
      log(this.module, this.submodule, null, 'Plugin unloaded.');
    } catch (e) {
      error(this.module, this.submodule, null,
        'An error occurred during shutting down! It\'s heavily recommended to reload Discord to ensure there is no conflicts.', e
      );
    }
  }
}

module.exports = API;
