import { Builtin } from '@vizality/entities';

import modules from './modules';

export default class Attributes extends Builtin {
  start () {
    this.callbacks = [];

    for (const mod of Object.values(modules)) {
      (async () => {
        const callback = await mod();
        if (typeof callback === 'function') {
          this.callbacks.push(callback);
        }
      })();
    }

    const root = document.documentElement;
    root.setAttribute('vizality', '');
  }

  stop () {
    this.callbacks.forEach(callback => callback());
  }
}
