import * as _chunk from 'chunk-text';
import pluralize from 'pluralize';

/**
 * @module util.string
 * @namespace util.string
 * @memberof util
 * @version 0.0.1
 */

export const isSingular = string => {
  return pluralize.isSingular(string);
};

export const isPlural = string => {
  return pluralize.isPlural(string);
};

export const toSingular = string => {
  return pluralize.singular(string);
};

export const toPlural = string => {
  return pluralize(string);
};

export const chunk = (string, numberOfCharacters) => {
  return _chunk(string, numberOfCharacters);
};

export const toHash = string => {
  let h1 = 0xdeadbeef ^ 0;
  let h2 = 0x41c6ce57 ^ 0;
  for (let i = 0, ch; i < string.length; i++) {
    ch = string.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

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
export const stripDiacritics = string => {
  const pattern = /[\u0300-\u036f]/g;
  return string.normalize('NFD').replace(pattern, '').normalize('NFC');
};

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
export const isUrl = string => {
  const pattern = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/gm;
  return !!pattern.test(string);
};

/**
 * Converts a string to camel case.
 * @param {*} string Value to convert
 * @returns {string} String in camel case
 * @example
 * // returns `iAmACamelCaseString`
 * toCamelCase('I am a CAMEL CASE string.')
 */
export const toCamelCase = string => {
  return global._.camelCase(string);
};

/**
 * Converts a string to lowercase dot case.
 * @param {*} string String to convert
 * @returns {string} String in dot case
 * @example
 * // returns `i.am.a.dot.case.string`
 * toDotCase('I am a DOT CASE string.')
 */
export const toDotCase = string => {
  return global._.lowerCase(string).replace(/ /g, '.');
};

/**
 * Converts a string to title case.
 * @param {*} string String to convert
 * @returns {string} String in title case
 * @example
 * // returns `I Am A Title Case String`
 * toTitleCase('I am a TITLE CASE string.')
 */
export const toTitleCase = string => {
  return global._.startCase(global._.camelCase(string));
};

/**
 * Converts a string to sentence case.
 * @param {*} string String to convert
 * @returns {string} String in sentence case
 * @example
 * // returns `I am a sentence case string`
 * toSentenceCase('i am a SENTENCE CASE string.')
 */
export const toSentenceCase = string => {
  return global._.upperFirst(global._.lowerCase(string));
};

/**
 * Converts a string to pascal case.
 * @param {*} string String to convert
 * @returns {string} String in pascal case
 * @example
 * // returns `IAmAPascalCaseString`
 * toPascalCase('I am a PASCAL CASE string.')
 */
export const toPascalCase = string => {
  return global._.startCase(global._.camelCase(string)).replace(/ /g, '');
};

/**
 * Converts a string to lowercase path case.
 * @param {*} string String to convert
 * @returns {string} String in path case
 * @example
 * // returns `i/am/a/path/case/string`
 * toPathCase('I am a PATH CASE string.')
 */
export const toPathCase = string => {
  return global._.lowerCase(string).replace(/ /g, '/');
};

/**
 * Converts a string to lowercase snake case.
 * @param {*} string String to convert
 * @returns {string} String in snake case
 * @example
 * // returns `i_am_a_snake_case_string`
 * toSnakeCase('I am a SNAKE CASE string.')
 */
export const toSnakeCase = string => {
  return global._.snakeCase(string);
};

/**
 * Converts a string to kebab case.
 * @param {*} string String to convert
 * @returns {string} String in kebab case
 * @example
 * // returns `i-am-a-kebab-case-string`
 * toKebabCase('i am a keBab CASE string.')
 */
export const toKebabCase = string => {
  return global._.kebabCase(string);
};

/**
 * Checks if the input is a string.
 * @param {*} input Argument input
 * @returns {boolean} Whether or not the input is a string
 */
export const isString = input => {
  return global._.isString(input);
};

/**
 * Asserts that the input is a string. If it isn't, throw an error, otherwise do nothing.
 * @param {*} input Argument input
 * @returns {void}
 * @throws {TypeError} Throw an error if the input is not a string
 */
export const assertString = input => {
  if (!this.isString(input)) {
    return new TypeError(`Input must be a string, but received type of ${typeof input}.`);
  }
};
