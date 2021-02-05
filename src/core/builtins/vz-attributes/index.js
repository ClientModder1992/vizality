import { Builtin } from '@vizality/entities';

import modules from './modules';

export default class Attributes extends Builtin {
  start () {
    document.documentElement.setAttribute('vizality', '');
    this.callbacks = [];

    for (const mod of Object.keys(modules)) {
      (async () => {
        try {
          const callback = await modules[mod]();
          if (typeof callback === 'function') {
            this.callbacks.push(callback);
          }
        } catch (err) {
          this.error(mod, err);
        }
      })();
    }
  }

  stop () {
    for (const callback of this.callbacks) {
      (async () => {
        try {
          return callback();
        } catch (err) {
          this.error(err);
        }
      })();
    }
  }
}
