const _find = require('./_find');

const findEntriesByValue = (object, targetValue, exact = false) => {
  return _find(object, targetValue, exact, 'value');
};

module.exports = findEntriesByValue;
