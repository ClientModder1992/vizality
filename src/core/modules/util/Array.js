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

/**
 * Asserts that the input is an array. If it isn't, throw an error, otherwise do nothing.
 * @param {Array} array Array to process
 * @param {('and'|'or')} [lastItemConnector='and'] Word that is used to connect the last array item
 * @returns {string} Array returned as a string list, joined by commas and "and" or "or" for the final item
 */
export const toSentence = (array, lastItemConnector = 'and') => {
  try {
    this.assertArray(array);
    let type;
    switch (lastItemConnector?.toLowerCase()) {
      case 'and': type = 'conjunction'; break;
      case 'or': type = 'disjunction'; break;
      default: throw new Error('Second argument must be a string value of "and" or "or".');
    }

    const locale = import('../i18n').chosenLocale;
    const formatter = new Intl.ListFormat(locale, { style: 'long', type });
    return formatter.format(array);
  } catch (err) {
    return _error(err);
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
