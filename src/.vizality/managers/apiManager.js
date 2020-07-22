const { API_FOLDER } = require('@constants');
const { logger: { error } } = require('@util');

const { join } = require('path');
const { readdirSync, statSync } = require('fs');

class APIManager {
  constructor () {
    this.dir = API_FOLDER;
    this.apis = [];
  }

  mount (api) {
    try {
      const APIClass = require(join(this.dir, api));
      api = api.replace(/\.js$/, '');
      vizality.api[api] = new APIClass();
      this.apis.push(api);
    } catch (e) {
      error('Manager', 'API', null, `An error occurred while initializing "${api}"!`, e);
    }
  }

  async load () {
    for (const api of this.apis) {
      await vizality.api[api]._load();
    }
  }

  async unload () {
    for (const api of this.apis) {
      await vizality.api[api]._unload();
    }
  }

  // Start
  async startAPIs () {
    this.apis = [];
    readdirSync(this.dir)
      .filter(f => statSync(join(this.dir, f)).isFile())
      .forEach(filename => this.mount(filename));
    await this.load();
  }
}

module.exports = APIManager;
