const { object: { findByValue } } = require('vizality/util');

const classes = require('../classes');

const findClass = (targetValue, exact = false) => {
  return findByValue(classes, targetValue, exact);
};

module.exports = findClass;
