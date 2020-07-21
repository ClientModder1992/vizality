const _find = require('./_find');

const findEntries = (object, targetValue, exact = false) => {
  return _find(object, targetValue, exact, 'all');
};

module.exports = findEntries;
