const _find = require('./_find');

const findEntriesByKey = (object, targetValue, exact = false) => {
  return _find(object, targetValue, exact, 'key');
};

module.exports = findEntriesByKey;
