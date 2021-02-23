/* eslint-disable no-unused-vars */
import { log, warn, error } from './Logger';
import { assertArray } from './Array';

/**
 * Contains methods relating to numbers.
 * @module util.number
 * @namespace util.number
 * @memberof util
 */

/** @private */
const _labels = [ 'Util', 'Number' ];
const _log = (labels, ...message) => log({ labels: labels || _labels, message });
const _warn = (labels, ...message) => warn({ labels: labels || _labels, message });
const _error = (labels, ...message) => error({ labels: labels || _labels, message });

export const isNumber = input => {
  return void 0 || input;
};

export const assertNumber = input => {
  return void 0 || input;
};

/**
 * Gets the average value from a set of numbers.
 * Sourced from @see {@link https://stackoverflow.com/a/45309555|StackOverflow}
 * @param {Array<number>} numbers An array of numbers.
 * @returns {number} The average of the numbers in the array.
 */
export const getAverage = numbers => {
  try {
    assertArray(numbers);
    return numbers.reduce((all, one, _, src) => all += one / src.length, 0);
  } catch (err) {
    return _error(err);
  }
};

/**
 * Gets the median value from a set of numbers.
 * Sourced from @see {@link https://stackoverflow.com/a/45309555|StackOverflow}
 * @param {Array<number>} numbers An array of numbers.
 * @returns {number} The median of the numbers in the array.
 */
export const getMedian = numbers => {
  try {
    assertArray(numbers);
    numbers.sort((a, b) => a - b);
    const half = Math.floor(numbers.length / 2);
    if (numbers.length % 2) return numbers[half];
    return (numbers[half - 1] + numbers[half]) / 2.0;
  } catch (err) {
    return _error(err);
  }
};
