import { Builtin } from '@vizality/entities';

import * as modules from './modules';

export default class Attributes extends Builtin {
  async start () {
    document.documentElement.setAttribute('vizality', '');
    this.callbacks = [];
    Object.keys(modules).forEach(async mod => {
      try {
        const callback = await modules[mod](this);
        if (typeof callback === 'function') {
          this.callbacks.push(callback);
        }
      } catch (err) {
        return this.error(modules[mod].labels.concat(mod), err);
      }
    });
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
