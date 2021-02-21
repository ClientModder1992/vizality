/* eslint-disable no-unused-vars */
import { isObject as _isObject, isEmpty as _isEmpty } from 'lodash';

import { log, warn, error } from './Logger';
import { toPlural } from './String';

/**
 * Contains methods relating to objects.
 * @module util.object
 * @namespace util.object
 * @memberof util
 */

/** @private */
const _module = 'Util';
const _submodule = 'Object';
const _log = (...message) => log({ module: _module, submodule: _submodule, message });
const _warn = (...message) => warn({ module: _module, submodule: _submodule, message });
const _error = (...message) => error({ module: _module, submodule: _submodule, message });

// @todo Clean this up.
export const _traverse = function*(obj, targetValue, exactMatch = false, type, currentPath = '') {
  if (typeof obj !== 'object') return false;

  targetValue = targetValue.toLowerCase();

  let matchedKeys;

  if (exactMatch) {
    if (type === 'key') {
      matchedKeys = Object.keys(obj).filter(key => key.toLowerCase() === targetValue);
    } else if (type === 'value') {
      matchedKeys = Object.keys(obj).filter(key => obj[key] === targetValue);
    } if (type === 'all') {
      matchedKeys = Object.keys(obj).filter(key => key.toLowerCase() === targetValue || obj[key] === targetValue);
    }
  } else {
    if (type === 'key') {
      matchedKeys = Object.keys(obj).filter(key => key.toLowerCase().includes(targetValue));
    } else if (type === 'value') {
      matchedKeys = Object.keys(obj).filter(key => typeof obj[key] === 'string' && obj[key].toLowerCase().includes(targetValue));
    } if (type === 'all') {
      matchedKeys = Object.keys(obj).filter(key =>
        key.toLowerCase().includes(targetValue) || (typeof obj[key] === 'string' && obj[key].toLowerCase().includes(targetValue))
      );
    }
  }

  if (matchedKeys[0]) yield *matchedKeys.map(key => currentPath ? `${currentPath}.${key}` : key);

  for (const key in obj) {
    const found = this._traverse(obj[key], targetValue, exactMatch, type, currentPath ? `${currentPath}.${key}` : key);
    if (found) yield *found;
  }
};

// @todo Clean this up.
export const _find = (obj, targetValue, exact = false, type) => {
  if (typeof targetValue !== 'string' || targetValue.trim() === '') {
    // @todo throw new TypeError(`"note" argument must be a string (received ${typeof note})`); format
    return _error(`Expected a string argument but received ${typeof targetValue}'.`);
  }

  let results;

  if (type === 'key' || type === 'value' || type === 'all') {
    results = [ ...this._traverse(obj, targetValue, exact, type) ];
  } else {
    return _error(`Argument "type" must be a string value of "key", "value", or "both"`);
  }

  const tempResults = [ ...results ];
  const longestResult = tempResults.sort((a, b) => b.length - a.length)[0];
  const resultsText = results && results.length === 1 ? 'result' : 'results';
  const choiceWord = exact ? 'matching' : 'containing';

  /*
   * @todo This needs reworking somehow. It is bugged for objects which contain
   * keys with period(s) in them.
   */
  _log(`${results.length} ${resultsText} found for ${type === 'key' || type === 'value' ? toPlural(type) : 'entries'} ${choiceWord} '${targetValue}' ${results.length ? ':' : ''}`);

  if (exact) {
    results = results.map(result => result).join('\n');
  } else {
    results = results.map(result => {
      const resultArray = result.split('.');
      let outputResult = obj;

      for (const result of resultArray) {
        /**
         * Weird bug caused by splitting by . above, because some
         * keys do have a . in them, which causes issues: @see {@link https://i.imgur.com/2pvyjlI.png}
         */
        try {
          outputResult = outputResult[result];
        } catch (err) {
          continue;
        }

        if (!outputResult) outputResult = [ 'N̶U̶L̶L' ];
      }

      if (typeof outputResult === 'object') return `${result.padEnd(longestResult.length, ' ')}`;

      /*
       * We're using replace(/\n/g, '\\n') here particularly because Discord likes to sometimes
       * include \n for line breaks in their i18n strings, and if so we want to see them when
       * searching their strings.
       */
      return `${result.padEnd(longestResult.length, ' ')} | ${outputResult.replace(/\n/g, '\\n')}`;
    }).join('\n');
  }

  if (results.length > 0) return console.log(results);
};

/**
 * Checks if the input is an object.
 * @param {*} input Argument input
 * @returns {boolean} Whether or not the input is an object
 */
export const isObject = input => {
  return _isObject(input);
};

/**
 * Asserts that the input is an object.
 * If it isn't an object, it throws an error, otherwise it does nothing.
 * @param {*} input Argument input
 * @throws {TypeError} Throw an error if the input is not an object
 */
export const assertObject = input => {
  if (!this.isObject(input)) {
    throw new TypeError(`Expected an object but received ${typeof input}.`);
  }
};

/**
 * Checks if the input is an empty object.
 * @param {*} input Argument input
 * @returns {boolean} Whether or not the input is an empty object
 */
export const isEmptyObject = input => {
  return _isEmpty(input);
};

export const keysToLowerCase = (obj, nested = false) => {
  return Object.keys(obj).reduce((accumulator, key) => {
    let val = obj[key];
    if (nested && typeof val === 'object') val = this.keysToLowerCase(val);
    accumulator[key.toLowerCase()] = val;
    return accumulator;
  }, {});
};

export const excludeProperties = (obj, ...keys) => {
  return Object.keys(obj)
    .filter(key => !keys.includes(key))
    .reduce((accumulator, key) => ({ ...accumulator, [key]: obj[key] }), {});
};

export const findEntriesByKeyword = (obj, keyword, exact = false) => {
  return this._find(obj, keyword, exact, 'all');
};

export const findEntriesByKey = (obj, key, exact = false) => {
  return this._find(obj, key, exact, 'key');
};

export const findEntriesByValue = (obj, value, exact = false) => {
  return this._find(obj, value, exact, 'value');
};

export const removeEmptyProperties = obj => {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object') this.removeEmptyProperties(obj[key]);
    else if (obj[key] === undefined) delete obj[key];
  });
  return obj;
};
