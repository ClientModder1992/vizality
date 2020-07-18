const _findBy = require('./_findBy');

const findByKey = (object, targetValue, exact = false) => {
  return _findBy(object, targetValue, exact, 'key');
};

module.exports = findByKey;
