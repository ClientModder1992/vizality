/* eslint-disable no-useless-return */
const Type = require('./Type');

/**
 * @module Util.Array
 * @namespace Util.Array
 * @memberof Util
 * @version 0.0.1
 */
module.exports = class Array {
  /**
   * Checks if the input is an array.
   * @param {*} input Argument input
   * @param {boolean} [throwError=false] Whether or not it should throw an error
   * @returns {boolean} Whether or not the input is an array
   */
  static isArray (input, throwError = false) {
    return Type.isType(input, 'Array', throwError);
  }

  /**
   * Asserts that the input is an array. If it isn't, throw an error, otherwise do nothing.
   * @param {*} input Argument input
   * @returns {void}
   * @throws {TypeError} Throw an error if the input is not an array
   */
  static assertArray (input) {
    if (Type.assertType(input, 'Array')) return;
  }
};
