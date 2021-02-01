import { readdirSync, statSync } from 'fs';
import { join, parse } from 'path';

import { log, warn, error } from '@vizality/util/logger';
import { Directories } from '@vizality/constants';

export default class APIManager {
  constructor () {
    this.dir = Directories.API;
    this.apis = [];
    this._module = 'Manager';
    this._submodule = 'API';
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

  async terminate () {
    for (const api of this.apis) {
      await vizality.api[api]._unload(false);
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
  _log (...data) {
    log({ module: this._module, submodule: this._submodule }, ...data);
  }

  /** @private */
  _warn (...data) {
    warn({ module: this._module, submodule: this._submodule }, ...data);
  }

  /** @private */
  _error (...data) {
    error({ module: this._module, submodule: this._submodule }, ...data);
  }
}
