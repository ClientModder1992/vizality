const Webpack = require('../webpack');

const _getModules = (filter, all = false) => {
  const moduleInstances = Object.values(Webpack.instance.cache).filter(m => m.exports);

  if (all) {
    const exports = moduleInstances.filter(m => filter(m.exports)).map(m => m.exports);
    const expDefault = moduleInstances.filter(m => m.exports.default && filter(m.exports.default)).map(m => m.exports.default);
    return exports.concat(expDefault);
  }

  const exports = moduleInstances.find(m => filter(m.exports));

  if (exports) {
    return exports.exports;
  }
  const expDefault = moduleInstances.find(m => m.exports.default && filter(m.exports.default));
  if (expDefault) {
    return expDefault.exports.default;
  }
  return null;
};

module.exports = _getModules;
