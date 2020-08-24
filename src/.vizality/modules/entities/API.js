const Events = require('events');
const Logger = require('../util/Logger');

module.exports = class API extends Events {
  constructor () {
    super();
    this._module = 'API';
    this._submodule = this.constructor.name;
    this._ready = false;
  }

  async initialize () {
    try {
      if (typeof this.onStart === 'function') {
        await this.onStart();
      }
      Logger.log(this._module, this._submodule, null, 'API initialized.');
      this._ready = true;
    } catch (err) {
      Logger.error(this._module, this._submodule, null, 'An error occurred during initialization!', err);
    }
  }

  async terminate () {
    try {
      if (typeof this.onStop === 'function') {
        await this.onStop();
      }
      this._ready = false;
      Logger.log(this._module, this._submodule, null, 'API terminated.');
    } catch (err) {
      Logger.error(this._module, this._submodule, null,
        'An error occurred during shutting down! It\'s heavily recommended to reload Discord to ensure there is no conflicts.', err
      );
    }
  }
};
