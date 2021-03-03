import { Builtin } from '@vizality/entities';

import * as modules from './modules';

export default class Enhancements extends Builtin {
  async start () {
    this.injectStyles('styles/main.scss');
    this.callbacks = [];
    for (const mod of Object.keys(modules)) {
      try {
        const callback = await modules[mod].default(this);
        if (typeof callback === 'function') {
          this.callbacks.push(callback);
        }
      } catch (err) {
        return this.error(modules[mod].labels.concat(mod), err);
      }
    }
  }

  stop () {
    for (const callback of this.callbacks) {
      (async () => {
        try {
          return callback();
        } catch (err) {
          return this.error(err);
        }
      })();
    }
  }
}
