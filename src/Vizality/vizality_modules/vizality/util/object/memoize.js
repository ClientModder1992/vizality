const { warn } = require('../logger');

const memoize = (object) => {
  const MODULE = 'Module';
  const SUBMODULE = 'Util:object:memoize';

  const proxy = new Proxy(object, {
    get (obj, mod) {
      if (!obj.hasOwnProperty(mod)) return undefined;
      if (Object.getOwnPropertyDescriptor(obj, mod).get) {
        const value = obj[mod];
        delete obj[mod];
        obj[mod] = value;
      }
      return obj[mod];
    },
    set (obj, mod, value) {
      if (obj.hasOwnProperty(mod)) return warn(MODULE, SUBMODULE, null, 'Trying to overwrite existing property.');
      obj[mod] = value;
      return obj[mod];
    }
  });

  Object.defineProperty(proxy, 'hasOwnProperty', { value (prop) {
    return this[prop] !== undefined;
  } });

  return proxy;
};

module.exports = memoize;
