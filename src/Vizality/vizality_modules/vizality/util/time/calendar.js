/**
 * moment().calendar();
 * moment().calendar(referenceDay);
 * moment().calendar(referenceDay, formats);  // from 2.10.5
 * moment().calendar(formats);  // from 2.25.0
 */

const moment = require('./moment');

const calendar = (...args) => {
  return moment().calendar(...args);
};

module.exports = calendar;
