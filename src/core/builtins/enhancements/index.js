import { Builtin } from '@vizality/entities';

import * as modules from './modules';

export default class Enhancements extends Builtin {
  start () {
    this.injectStyles('styles/main.scss');
    this.callbacks = [];
    for (const mod of Object.keys(modules)) {
      (async () => {
        try {
          const callback = await modules[mod].default();
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
