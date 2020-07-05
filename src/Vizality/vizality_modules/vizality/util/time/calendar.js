/**
 * moment().calendar();
 * moment().calendar(referenceDay);
 * moment().calendar(referenceDay, formats);  // from 2.10.5
 * moment().calendar(formats);  // from 2.25.0
 */

const time = require('../time');

const calendar = (...args) => {
  return time().calendar(...args);
};

module.exports = calendar;
