const Logger = require('./Logger');
const Array = require('./Array');

const _module = 'Module';
const _submodule = 'Utilities:Misc';

/**
 * @module Util.Misc
 * @namespace Util.Misc
 * @memberof Util
 * @version 0.0.1
 */
module.exports = class Misc {
  /**
   * A simple utility for conditionally joining class names together.
   * @see {@link https://github.com/JedWatson/classnames}
   * @param {string|Object|Array} items Potential class names we're trying to join
   * @returns {string} String of class names joined together
   */
  static joinClassNames (...items) {
    const classes = [];
    for (const item of items) {
      if (!item) continue;
      const argType = typeof item;
      if (argType === 'string' || argType === 'number') {
        classes.push(item);
      } else if (Array.isArray(item)) {
        if (item.length) {
          const inner = this.joinClassNames.apply(null, item);
          if (inner) classes.push(inner);
        }
      } else if (argType === 'object') {
        if (item.toString !== Object.prototype.toString) {
          classes.push(item.toString());
        } else {
          for (const key in item) {
            if (item.hasOwnProperty(key) && item[key]) {
              classes.push(key);
            }
          }
        }
      }
    }
    return classes.join(' ');
  }

  /**
   * A simple utility to get an idea of run-time performance of functions or
   * blocks of code.
   * @param {*} tests Test case
   * @returns {void} Returns log information in console
   */
  static async checkPerformance (...tests) {
    if (!tests) {
      return Logger.error(_module, `${_submodule}:checkPerformance`, null, 'You must supply at least one test case.');
    }

    const outcome = {};

    let testNumber = 0;

    // Set up and run the test case
    for (const test of tests) {
      testNumber++;

      const before = performance.now();
      await eval(test);
      const after = performance.now();

      const time = parseFloat((after - before).toFixed(4)).toString().replace(/^0+/, '');

      Logger.log(_module, `${_submodule}:checkPerformance`, null, `Case #${testNumber} took ${time} ms.`);

      outcome[testNumber] = time;
    }

    // No need to do the following code block if there's only 1 argument
    if (tests.length === 1) return;

    const winner = Object.entries(outcome).sort((current, next) => current[1] - next[1])[0];
    const secondPlace = Object.entries(outcome).sort((current, next) => current[1] - next[1])[1];
    const winningTime = winner[1];
    const secondPlaceTime = secondPlace[1];

    // Limit the result to 4 decimal places and remove any leading zeroes
    const timeDifference = parseFloat((secondPlaceTime - winningTime).toFixed(4)).toString().replace(/^0+/, '');

    // Convert difference to a percentage and limit the result to decimal places
    const percentPerformanceGain = parseFloat(((timeDifference / winningTime) * 100).toFixed(2));

    return Logger.log(_module, `${_submodule}:checkPerformance`, null,
      `Case #${winner[0]} is the winner with a time of ${winningTime} ms. That's
      ${percentPerformanceGain}% faster than second place!`
    );
  }

  static sleep (time) {
    return new Promise(resolve =>
      setTimeout(resolve, time)
    );
  }
};
