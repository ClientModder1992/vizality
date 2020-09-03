const { object: { findEntriesByValue } } = require('@utilities');

const classes = require('../classes');

const findClass = (targetValue, exact = false) => {
  return findEntriesByValue(classes, targetValue, exact);
};

module.exports = findClass;
