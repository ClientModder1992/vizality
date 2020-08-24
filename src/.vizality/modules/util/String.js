/* eslint-disable no-extra-boolean-cast *//* eslint-disable no-useless-return */
const pluralize = require('pluralize');
const Type = require('./Type');

/**
 * @module Util.String
 * @namespace Util.String
 * @memberof Util
 * @version 0.0.1
 */
module.exports = class String {
  static isSingular (string) {
    return pluralize.isSingular(string);
  }

  static isPlural (string) {
    return pluralize.isPlural(string);
  }

  static toSingular (string) {
    return pluralize.singular(string);
  }

  static toPlural (string) {
    return pluralize(string);
  }

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
  static stripDiacritics (string) {
    const pattern = /[\u0300-\u036f]/g;
    return string.normalize('NFD').replace(pattern, '').normalize('NFC');
  }

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
  static isUrl (string) {
    const pattern = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/gm;
    return !!pattern.test(string);
  }

  /**
   * Converts a string to camel case.
   * @param {*} string Value to convert
   * @returns {string} String in camel case
   * @example
   * // returns `iAmACamelCaseString`
   * toCamelCase('I am a CAMEL CASE string.')
   */
  static toCamelCase (string) {
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
  }

  /**
   * Converts a string to lowercase dot case.
   * @param {*} string String to convert
   * @returns {string} String in dot case
   * @example
   * // returns `i.am.a.dot.case.string`
   * toDotCase('I am a DOT CASE string.')
   */
  static toDotCase (string) {
    return string
      .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, '')
      .replace(/([a-z])([A-Z])/g, (m, a, b) => {
        return `${a}_${b.toLowerCase()}`;
      })
      .replace(/[^A-Za-z0-9]+|_+/g, '.')
      .toLowerCase().trim();
  }

  /**
   * Converts a string to header case.
   * @param {*} string String to convert
   * @returns {string} String in header case
   * @example
   * // returns `I Am A Header Case String`
   * toHeaderCase('I am a HEADER CASE string.')
   */
  static toHeaderCase (string) {
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
  }

  /**
   * Converts a string to pascal case.
   * @param {*} string String to convert
   * @returns {string} String in pascal case
   * @example
   * // returns `IAmAPascalCaseString`
   * toPascalCase('I am a PASCAL CASE string.')
   */
  static toPascalCase (string) {
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
  }

  /**
   * Converts a string to lowercase path case.
   * @param {*} string String to convert
   * @returns {string} String in path case
   * @example
   * // returns `i/am/a/path/case/string`
   * toPathCase('I am a PATH CASE string.')
   */
  static toPathCase (string) {
    return string
      .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, '')
      .replace(/([a-z])([A-Z])/g, (m, a, b) => {
        return `${a}_${b.toLowerCase()}`;
      })
      .replace(/[^A-Za-z0-9]+|_+/g, '/')
      .toLowerCase().trim();
  }

  /**
   * Converts a string to lowercase snake case.
   * @param {*} string String to convert
   * @returns {string} String in snake case
   * @example
   * // returns `i_am_a_snake_case_string`
   * toSnakeCase('I am a SNAKE CASE string.')
   */
  static toSnakeCase (string) {
    return string
      .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, '')
      .replace(/([a-z])([A-Z])/g, (m, a, b) => {
        return `${a}_${b.toLowerCase()}`;
      })
      .replace(/[^A-Za-z0-9]+|_+/g, '_')
      .toLowerCase().trim();
  }

  // @todo Find a better version.
  static toKebabCase (string) {
    let from = 'ąàáäâãåæăćčĉęèéëêĝĥìíïîĵłľńňòóöőôõðøśșşšŝťțţŭùúüűûñÿýçżźž';
    let to = 'aaaaaaaaaccceeeeeghiiiijllnnoooooooossssstttuuuuuunyyczzz';

    from += from.toUpperCase();
    to += to.toUpperCase();
    to = to.split('');

    // For tokens requiring multitoken output
    from += 'ß';
    to.push('ss');

    return string
      .trim()
      .replace(/.{1}/g, c => {
        const index = from.indexOf(c);
        return index === -1 ? c : to[index];
      })
      .replace(/[^\w\s-]/g, '-').toLowerCase()
      .replace(/([A-Z])/g, '-$1')
      .replace(/[-_\s]+/g, '-').toLowerCase();
  }

  /**
   * Checks if the input is a string.
   * @param {*} input Argument input
   * @param {boolean} [throwError=false] Whether or not it should throw an error
   * @returns {boolean} Whether or not the input is a string
   */
  static isString (input, throwError = false) {
    return Type.isType(input, 'Array', throwError);
  }

  /**
   * Asserts that the input is a string. If it isn't, throw an error, otherwise do nothing.
   * @param {*} input Argument input
   * @returns {void}
   * @throws {TypeError} Throw an error if the input is not a string
   */
  static assertString (input) {
    if (Type.assertType(input, 'String')) return;
  }
};
