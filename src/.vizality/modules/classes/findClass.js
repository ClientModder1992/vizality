const { object: { findEntriesByValue } } = require('@utilities');

const classes = require('../classes');

const findClass = (value, exact = false) => {
  return findEntriesByValue(classes, value, exact);
};

module.exports = findClass;
