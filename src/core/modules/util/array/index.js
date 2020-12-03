/**
 * @module util.array
 * @namespace util.array
 * @memberof util
 * @version 0.0.1
 */
const Array = module.exports = {
  /**
   * Checks if the input is an array.
   * @param {*} input Argument input
   * @returns {boolean} Whether or not the input is an array
   */
  isArray (input) {
    return global._.isArray(input);
  },

  /**
   * Asserts that the input is an array. If it isn't, throw an error, otherwise do nothing.
   * @param {*} input Argument input
   * @returns {void}
   * @throws {TypeError} Throw an error if the input is not an array
   */
  assertArray (input) {
    if (!Array.isArray(input)) {
      return new TypeError(`Input must be an array, but received type of ${typeof input}.`);
    }
  },

  getRandomArrayItem (array) {
    return global._.sample(array);
  }
};
