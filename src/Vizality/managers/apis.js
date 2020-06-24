const { join } = require('path');
const { readdirSync, statSync } = require('fs');

module.exports = class APIManager {
  constructor () {
    this.apiDir = join(__dirname, '..', 'apis');
    this.apis = [];
  }

  mount (api) {
    try {
      const APIClass = require(join(this.apiDir, api));
      api = api.replace(/\.js$/, '');
      vizality.api[api] = new APIClass();
      this.apis.push(api);
    } catch (e) {
      console.error('%c[Vizality:API]', 'color: #7289da', `An error occurred while initializing "${api}"!`, e);
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
    readdirSync(this.apiDir)
      .filter(f => statSync(join(this.apiDir, f)).isFile())
      .forEach(filename => this.mount(filename));
    await this.load();
  }
};
