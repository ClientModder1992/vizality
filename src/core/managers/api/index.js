import { readdirSync, statSync } from 'fs';
import { join } from 'path';

import { Directories } from '@vizality/constants';
import { error } from '@vizality/util/logger';

export default class APIManager {
  constructor () {
    this.dir = Directories.API;
    this.apis = [];
  }

  async mount (api) {
    try {
      const apiModule = await import(join(this.dir, api));
      const APIClass = apiModule && apiModule.__esModule ? apiModule.default : apiModule;

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
      await vizality.api[api].stop();
    }
  }

  async initialize () {
    this.apis = [];
    const apis = readdirSync(this.dir).filter(f => statSync(join(this.dir, f)).isDirectory());

    for (const api of apis) {
      await this.mount(api);
    }

    await this.start();
  }
}
