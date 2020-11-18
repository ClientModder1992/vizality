/* eslint-disable no-useless-return *//* eslint-disable no-unused-vars */
const { assertType, isType } = require('../type');

/**
 * @module util.array
 * @namespace util.array
 * @memberof util
 * @version 0.0.1
 */
const array = module.exports = {
  /**
   * Checks if the input is an array.
   * @param {*} input Argument input
   * @param {boolean} [throwError=false] Whether or not it should throw an error
   * @returns {boolean} Whether or not the input is an array
   */
  isArray (input, throwError = false) {
    return isType(input, 'Array', throwError);
  },

  /**
   * Asserts that the input is an array. If it isn't, throw an error, otherwise do nothing.
   * @param {*} input Argument input
   * @returns {void}
   * @throws {TypeError} Throw an error if the input is not an array
   */
  assertArray (input) {
    if (assertType(input, 'Array')) return;
  },

  getRandomArrayItem (array) {
    return array[Math.floor(Math.random() * array.length)];
  }
};
