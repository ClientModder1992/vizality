/* eslint-disable jsdoc/check-types *//* eslint-disable jsdoc/no-undefined-types */ /* eslint-disable no-useless-return */

/**
 * @module util.type
 * @namespace util.type
 * @memberof util
 * @version 0.0.1
 */

/**
 * Checks if the input is a certain type. Optionally throws an error.
 * Original source (modified):
 * @see {@link http://underscorejs.org/docs/underscore.html#section-147|underscore.js}
 * @param {*} input Argument input
 * @param {*} type Type to test for, case-insensitive. Valid types: Arguments, Function,
 * Array, Object, NaN, boolean, null, undefined, string, number, Date, RegExp, Error,
 * Symbol, Map, WeakMap, WeakSet
 * @param {boolean} [throwError=false] Whether or not it should throw an error
 * @returns {boolean} Whether or not the input is of a certain type
 */
const isType = (input, type, throwError = false) => {
  /**
   * Establish the root object, window (self) in the browser, global on the server,
   * or this in some virtual machines. We use self instead of window for WebWorker support.
   */
  const root = typeof self === 'object' && self.self === self && self ||
    typeof global === 'object' && global.global === global && global || {};

  type = type.toLowerCase();
  /*
    * Type-specific checks
    */
  // Array
  if (type === 'array') if (Array.isArray(input)) return true;
  // Object
  if (type === 'object') if (typeof input === 'function' || typeof input === 'object' && !!input) return true;
  // NaN
  if (type === 'nan') return root.isNaN(NaN);
  // Boolean
  if (type === 'boolean') return input === true || input === false || toString.call(input) === '[object Boolean]';
  // Null
  if (type === 'null') return input === null;
  // Undefined
  if (type === 'undefined') input === void 0;;


  // If throwError is false, test and return boolean
  if (!throwError) {
    /** @private */
    (function testInput (obj) {
      return toString.call(obj) === `[object ${type}]`;
    }());
  }

  // If the input isn't of type, and throwError is true, throw a TypeError
  if (throwError) {
    throw new TypeError(`Expected an argument of type ${type}, but received ${typeof input}.`);
  }

  return false;
};

// @todo Fix string case conversion for NaN, RegExp, WeakMap, and Weakset
/**
 * Asserts the input is of a certain type. If it isn't of type, throw an error, otherwise do nothing.
 * @param {*} input Argument input
 * @param {*} type Type to test for, case-insensitive. Valid types: Arguments, Function,
 * Array, Object, NaN, boolean, null, undefined, string, number, Date, RegExp, Error,
 * Symbol, Map, WeakMap, WeakSet
 * @returns {void}
 * @throws {TypeError} Throw an error if the input is not of a certain type
 */
const assertType = (input, type) => {
  const { toPascalCase } = require('../string');
  // @todo Circular dependency... Figure out how to fix.
  if (isType(input, toPascalCase(type), true)) return;
};

const isNull = (input, throwError = false) => {
  return isType(input, 'Null', throwError);
};

  module.exports = { isType, assertType, isNull };
