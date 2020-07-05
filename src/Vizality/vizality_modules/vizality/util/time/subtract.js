/*
 * moment().subtract(Number, String);
 * moment().subtract(Duration);
 * moment().subtract(Object);
 */

const moment = require('./moment');

module.exports = (...args) => {
  return moment().subtract(...args);
};
