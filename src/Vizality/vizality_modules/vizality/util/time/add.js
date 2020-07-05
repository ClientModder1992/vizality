/*
 * moment().add(Number, String);
 * moment().add(Duration);
 * moment().add(Object);
 */

const moment = require('./moment');

module.exports = (...args) => {
  return moment().add(...args);
};
