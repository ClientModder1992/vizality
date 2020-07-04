module.exports = (object) => {
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
      if (obj.hasOwnProperty(mod)) return console.warn('MemoizedObject - Trying to overwrite existing property');
      obj[mod] = value;
      return obj[mod];
    }
  });

  Object.defineProperty(proxy, 'hasOwnProperty', { value (prop) {
    return this[prop] !== undefined;
  } });

  return proxy;
};
