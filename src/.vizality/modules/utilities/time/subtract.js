/*
 * moment().subtract(Number, String);
 * moment().subtract(Duration);
 * moment().subtract(Object);
 */

const time = require('../time');

module.exports = (...args) => {
  return time().subtract(...args);
};
