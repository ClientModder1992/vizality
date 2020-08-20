const { logger: { error } } = require('@utilities');
const { DIR: { API_DIR } } = require('@constants');

const { readdirSync, statSync, existsSync } = require('fs');
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
    } catch (err) {
      error('Manager', 'API', null, `An error occurred while initializing "${api}"!`, err);
    }
  }

  async start () {
    for (const api of this.apis) {
      await vizality.api[api]._load();
    }
  }

  async stop () {
    for (const api of this.apis) {
      await vizality.api[api]._unload();
    }
  }

  // Start
  async initialize () {
    this.apis = [];
    const dir = readdirSync(this.dir);
    for (const item of dir) {
      const itemInDir = join(this.dir, item);
      const isDir = statSync(itemInDir).isDirectory();
      const hasIndex = existsSync(join(itemInDir, 'index.js'));
      if (isDir && hasIndex) this.mount(item);
    }
    await this.start();
  }
}

module.exports = APIManager;
