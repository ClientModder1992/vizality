/*
 * moment().add(Number, String);
 * moment().add(Duration);
 * moment().add(Object);
 */

const time = require('../time');

module.exports = (...args) => {
  return time().add(...args);
};
