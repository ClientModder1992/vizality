const _findBy = require('./_findBy');

const findByValue = (object, targetValue, exact = false) => {
  return _findBy(object, targetValue, exact, 'value');
};

module.exports = findByValue;
