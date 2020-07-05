/**
 * moment().format();                                // "2014-09-08T08:02:17-05:00" (ISO 8601, no fractional seconds)
 * moment().format("dddd, MMMM Do YYYY, h:mm:ss a"); // "Sunday, February 14th 2010, 3:25:50 pm"
 * moment().format("ddd, hA");                       // "Sun, 3PM"
 * moment().format("[Today is] dddd");               // "Today is Sunday"
 * moment('gibberish').format('YYYY MM DD');         // "Invalid date"
 */

const time = require('../time');

const format = (...args) => {
  return time().format(...args);
};

module.exports = format;
