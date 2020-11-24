const { readdirSync, statSync } = require('fs');
const { join } = require('path');

const { logger: { error } } = require('@vizality/util');
const { Directories } = require('@vizality/constants');

module.exports = class APIManager {
  constructor () {
    this.dir = Directories.API;
    this.apis = [];
  }

  mount (api) {
    try {
      const APIClass = require(join(this.dir, api));
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

  async initialize () {
    this.apis = [];
    readdirSync(this.dir)
      .filter(f => statSync(join(this.dir, f)).isDirectory())
      .forEach(dirname => this.mount(dirname));
    await this.start();
  }
};
