import { readdirSync, statSync } from 'fs';
import { join, parse } from 'path';

import { log, warn, error } from '@vizality/util/logger';
import { Directories } from '@vizality/constants';

export default class APIManager {
  constructor () {
    this.dir = Directories.API;
    this.apis = [];
    this._labels = [ 'Manager', 'API' ];
  }

  async mount (api) {
    try {
      api = parse(api).name;
      let apiModule;
      if (api === 'settings') {
        apiModule = await import(join(this.dir, api, 'Settings'));
      } else {
        apiModule = await import(join(this.dir, api));
      }

      const APIClass = apiModule && apiModule.__esModule ? apiModule.default : apiModule;
      vizality.api[api.toLowerCase()] = new APIClass();
      this.apis.push(api.toLowerCase());
    } catch (err) {
      return this._error(`An error occurred while initializing "${api}"!`, err);
    }
  }

  async load () {
    for (const api of this.apis) {
      await vizality.api[api]._load();
    }
  }

  async stop () {
    try {
      for (const api of this.apis) {
        await vizality.api[api]._unload(false);
      }
    } catch (err) {
      return this._error(`There was a problem shutting down ${this.type}!`, err);
    }
    return this._log(`All APIs have been unloaded!`);
  }

  async initialize () {
    this.apis = [];
    const apis =
      readdirSync(this.dir)
        .filter(f => statSync(join(this.dir, f)));

    for (const api of apis) {
      await this.mount(api);
    }

    await this.load();
  }

  /** @private */
  _log (...message) { log({ labels: this._labels, message }); }
  _warn (...message) { warn({ labels: this._labels, message }); }
  _error (...message) { error({ labels: this._labels, message }); }
}
