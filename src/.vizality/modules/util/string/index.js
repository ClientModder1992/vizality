/* eslint-disable no-extra-boolean-cast *//* eslint-disable no-useless-return *//* eslint-disable no-unused-vars */

const pluralize = require('pluralize');

const { isType, assertType } = require('../type');

/**
 * @module util.string
 * @namespace util.string
 * @memberof util
 * @version 0.0.1
 */
const string = module.exports = {
  isSingular (string) {
    return pluralize.isSingular(string);
  },

  isPlural (string) {
    return pluralize.isPlural(string);
  },

  toSingular (string) {
    return pluralize.singular(string);
  },

  toPlural (string) {
    return pluralize(string);
  },

  /**
   * Removes diacritics from letters in a string.
   * @param {string} string String to check
   * @returns {string} Whether or not the string is a valid URL format
   * @example
   * // returns `false`
   * isUrl('imaurl.com')
   * @example
   * // returns `true`
   * isUrl('https://google.com')
   */
  stripDiacritics (string) {
    const pattern = /[\u0300-\u036f]/g;
    return string.normalize('NFD').replace(pattern, '').normalize('NFC');
  },

  /**
   * Checks if a string is a valid URL format.
   * @param {string} string String to check
   * @returns {string} Whether or not the string is a valid URL format
   * @example
   * // returns `false`
   * isUrl('imaurl.com')
   * @example
   * // returns `true`
   * isUrl('https://google.com')
   */
  isUrl (string) {
    const pattern = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/gm;
    return !!pattern.test(string);
  },

  /**
   * Converts a string to camel case.
   * @param {*} string Value to convert
   * @returns {string} String in camel case
   * @example
   * // returns `iAmACamelCaseString`
   * toCamelCase('I am a CAMEL CASE string.')
   */
  toCamelCase (string) {
    return string
      .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, '')
      .replace(/[^A-Za-z0-9]+/g, '$')
      .replace(/([a-z])([A-Z])/g, (m, a, b) => {
        return `${a}$${b}`;
      })
      .toLowerCase().trim()
      .replace(/(\$)(\w)/g, (m, a, b) => {
        return b.toUpperCase();
      });
  },

  /**
   * Converts a string to lowercase dot case.
   * @param {*} string String to convert
   * @returns {string} String in dot case
   * @example
   * // returns `i.am.a.dot.case.string`
   * toDotCase('I am a DOT CASE string.')
   */
  toDotCase (string) {
    return string
      .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, '')
      .replace(/([a-z])([A-Z])/g, (m, a, b) => {
        return `${a}_${b.toLowerCase()}`;
      })
      .replace(/[^A-Za-z0-9]+|_+/g, '.')
      .toLowerCase().trim();
  },

  /**
   * Converts a string to header case.
   * @param {*} string String to convert
   * @returns {string} String in header case
   * @example
   * // returns `I Am A Header Case String`
   * toHeaderCase('I am a HEADER CASE string.')
   */
  toHeaderCase (string) {
    return string
      .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, '')
      .replace(/([a-z])([A-Z])/g, (m, a, b) => {
        return `${a}_${b.toLowerCase()}`;
      })
      .replace(/[^A-Za-z0-9]+|_+/g, ' ')
      .toLowerCase().trim()
      .replace(/( ?)(\w+)( ?)/g, (m, a, b, c) => {
        return a + b.charAt(0).toUpperCase() + b.slice(1) + c;
      });
  },

  /**
   * Converts a string to pascal case.
   * @param {*} string String to convert
   * @returns {string} String in pascal case
   * @example
   * // returns `IAmAPascalCaseString`
   * toPascalCase('I am a PASCAL CASE string.')
   */
  toPascalCase (string) {
    return string
      .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, '$')
      .replace(/[^A-Za-z0-9]+/g, '$')
      .replace(/([a-z])([A-Z])/g, (m, a, b) => {
        return `${a}$${b}`;
      })
      .toLowerCase().trim()
      .replace(/(\$)(\w?)/g, (m, a, b) => {
        return b.toUpperCase();
      });
  },

  /**
   * Converts a string to lowercase path case.
   * @param {*} string String to convert
   * @returns {string} String in path case
   * @example
   * // returns `i/am/a/path/case/string`
   * toPathCase('I am a PATH CASE string.')
   */
  toPathCase (string) {
    return string
      .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, '')
      .replace(/([a-z])([A-Z])/g, (m, a, b) => {
        return `${a}_${b.toLowerCase()}`;
      })
      .replace(/[^A-Za-z0-9]+|_+/g, '/')
      .toLowerCase().trim();
  },

  /**
   * Converts a string to lowercase snake case.
   * @param {*} string String to convert
   * @returns {string} String in snake case
   * @example
   * // returns `i_am_a_snake_case_string`
   * toSnakeCase('I am a SNAKE CASE string.')
   */
  toSnakeCase (string) {
    return string
      .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, '')
      .replace(/([a-z])([A-Z])/g, (m, a, b) => {
        return `${a}_${b.toLowerCase()}`;
      })
      .replace(/[^A-Za-z0-9]+|_+/g, '_')
      .toLowerCase().trim();
  },

  // @todo Find a better version.
  toKebabCase (string) {
    return string
      .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      .map(x => x.toLowerCase())
      .join('-');
  },

  /**
   * Checks if the input is a string.
   * @param {*} input Argument input
   * @param {boolean} [throwError=false] Whether or not it should throw an error
   * @returns {boolean} Whether or not the input is a string
   */
  isString (input, throwError = false) {
    return isType(input, 'Array', throwError);
  },

  /**
   * Asserts that the input is a string. If it isn't, throw an error, otherwise do nothing.
   * @param {*} input Argument input
   * @returns {void}
   * @throws {TypeError} Throw an error if the input is not a string
   */
  assertString (input) {
    if (assertType(input, 'String')) return;
  }
};
