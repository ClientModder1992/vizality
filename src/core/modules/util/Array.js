import { isArray as _isArray, isEmpty as _isEmpty, sample as _sample } from 'lodash';

/**
 * @module util.array
 * @namespace util.array
 * @memberof util
 * @version 0.0.1
 */

/**
 * Checks if the input is an array.
 * @param {*} input Argument input
 * @returns {boolean} Whether or not the input is an array
 */
export const isArray = input => {
  return _isArray(input);
};

export const isEmpty = input => {
  return _isEmpty(input);
};

/**
 * Asserts that the input is an array. If it isn't, throw an error, otherwise do nothing.
 * @param {*} input Argument input
 * @returns {void}
 * @throws {TypeError} Throw an error if the input is not an array
 */
export const assertArray = input => {
  if (!this.isArray(input)) {
    return new TypeError(`Input must be an array, but received type of ${typeof input}.`);
  }
};


/**
 * Asserts that the input is an array. If it isn't, throw an error, otherwise do nothing.
 * @param {Array} array Array to process
 * @returns {*} Returns a random item from the array
 */
export const getRandomItem = array => {
  try {
    return _sample(array);
  } catch (err) {
    return _error(err);
  }
};

export default { isArray, assertArray, getRandomArrayItem };
