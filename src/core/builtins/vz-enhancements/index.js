import { Builtin } from '@vizality/entities';

import * as modules from './modules';

export default class Enhancements extends Builtin {
  start () {
    this.injectStyles('styles/main.scss');
    this.callbacks = [];

    for (const mod of Object.values(modules)) {
      (async () => {
        const callback = await mod();
        if (typeof callback === 'function') {
          this.callbacks.push(callback);
        }
      })();
    }
  }

  stop () {
    this.callbacks.forEach(callback => callback());
  }
}
