const { logger: { error } } = require('@utilities');
const { DIR: { API_DIR } } = require('@constants');

const { readdirSync, statSync } = require('fs');
const { join } = require('path');

class APIManager {
  constructor () {
    this.dir = API_DIR;
    this.apis = [];
  }

  mount (api) {
    try {
      const APIClass = require(join(this.dir, api));
      api = api.replace(/\.js$/, '');
      vizality.api[api] = new APIClass();
      this.apis.push(api);
    } catch (e) {
      error('Manager', 'API', null, `An error occurred while initializing '${api}'!`, e);
    }
  }

  async start () {
    for (const api of this.apis) {
      await vizality.api[api].start();
    }
  }

  async stop () {
    for (const api of this.apis) {
      await vizality.api[api].start();
    }
  }

  // Start
  async initialize () {
    this.apis = [];
    readdirSync(this.dir)
      .filter(f => statSync(join(this.dir, f)).isFile())
      .forEach(filename => this.mount(filename));
    await this.start();
  }
}

module.exports = APIManager;
