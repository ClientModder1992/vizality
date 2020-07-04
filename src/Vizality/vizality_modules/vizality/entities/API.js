const Events = require('events');
const { logger } = require('vizality/util');

class API extends Events {
  constructor () {
    super();
    this.ready = false;
  }

  async _load () {
    try {
      if (typeof this.startAPI === 'function') {
        await this.startAPI();
      }
      this.log('API loaded.');
      this.ready = true;
    } catch (e) {
      this.error('An error occurred during initialization!', e);
    }
  }

  async _unload () {
    try {
      if (typeof this.apiWillUnload === 'function') {
        await this.apiWillUnload();
      }
      this.ready = false;
      this.log('Plugin unloaded.');
    } catch (e) {
      this.error('An error occurred during shutting down! It\'s heavily recommended to reload Discord to ensure there is no conflicts.', e);
    }
  }

  log (...data) {
    logger.log('API', this.constructor.name, null, ...data);
  }

  error (...data) {
    logger.log('API', this.constructor.name, null, ...data);
  }

  warn (...data) {
    logger.log('API', this.constructor.name, null, ...data);
  }
}

module.exports = API;
