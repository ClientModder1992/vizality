const { log, error } = require('../logger');
const { toPlural } = require('../string');

const _module = 'Module';
const _submodule = 'Util:Object';

/**
 * @module Util.Object
 * @namespace Util.Object
 * @memberof Util
 * @version 0.0.1
 */

// @todo Clean this up.
const _traverse = function* (object, targetValue, exactMatch = false, type, currentPath = '') {
  if (typeof object !== 'object') return false;

  targetValue = targetValue.toLowerCase();

  let matchedKeys;

  if (exactMatch) {
    if (type === 'key') {
      matchedKeys = Object.keys(object).filter(key => key.toLowerCase() === targetValue);
    } else if (type === 'value') {
      matchedKeys = Object.keys(object).filter(key => object[key] === targetValue);
    } if (type === 'all') {
      matchedKeys = Object.keys(object).filter(key => key.toLowerCase() === targetValue || object[key] === targetValue);
    }
  } else {
    if (type === 'key') {
      matchedKeys = Object.keys(object).filter(key => key.toLowerCase().includes(targetValue));
    } else if (type === 'value') {
      matchedKeys = Object.keys(object).filter(key => typeof object[key] === 'string' && object[key].toLowerCase().includes(targetValue));
    } if (type === 'all') {
      matchedKeys = Object.keys(object).filter(key =>
        key.toLowerCase().includes(targetValue) || (typeof object[key] === 'string' && object[key].toLowerCase().includes(targetValue))
      );
    }
  }

  if (matchedKeys[0]) yield *matchedKeys.map(key => currentPath ? `${currentPath}.${key}` : key);

  for (const key in object) {
    const found = _traverse(object[key], targetValue, exactMatch, type, currentPath ? `${currentPath}.${key}` : key);
    if (found) yield *found;
  }
};

// @todo Clean this up.
const _find = (object, targetValue, exact = false, type) => {
  if (typeof targetValue !== 'string' || targetValue.trim() === '') {
    // @todo throw new TypeError(`"note" argument must be a string (received ${typeof note})`); format
    return error(_module, `${_submodule}:_find`, null, `Expected a 'string' argument but received '${typeof targetValue}'.`);
  }

  let results;

  if (type === 'key' || type === 'value' || type === 'all') {
    results = [ ..._traverse(object, targetValue, exact, type) ];
  } else {
    return error(_module, `${_submodule}:_find`, null, `Argument 'type' must be a string value of 'key', 'value', or 'both'`);
  }

  const tempResults = [ ...results ];
  const longestResult = tempResults.sort((a, b) => b.length - a.length)[0];
  const resultsText = results && results.length === 1 ? 'result' : 'results';
  const choiceWord = exact ? 'matching' : 'containing';

  /*
   * if (!results || !results.length) {
   *   return log(module, submodule, null, `${results.length} ${resultsText} found for values ${choiceWord} '${targetValue}':`);
   * }
   */

  log(_module, `${_submodule}:_find`, null, `${results.length} ${resultsText} found for ${type === 'key' || type === 'value' ? toPlural(type) : 'entries'} ${choiceWord} '${targetValue}' ${results.length ? ':' : ''}`);

  if (exact) {
    results = results.map(result => result).join('\n');
  } else {
    results = results.map(result => {
      const resultArray = result.split('.');
      let outputResult = object;

      for (const result of resultArray) {
        outputResult = outputResult[result];
      }

      if (typeof outputResult === 'object') {
        return `${result.padEnd(longestResult.length, ' ')}`;
      }

      /*
       * We're using replace(/\n/g, '\\n') here particularly because Discord likes to sometimes
       * include \n for line breaks in their i18n strings, and if so we want to see them.
       */
      return `${result.padEnd(longestResult.length, ' ')} | ${outputResult.replace(/\n/g, '\\n')}`;
    }).join('\n');
  }

  if (results.length > 0) {
    return console.log(results);
  }
};

const isObject = (input) => {
  return typeof input === 'function' || typeof input === 'object' && !!input;
};

const assertObject = (input) => {
  return void 0 || input;
};

const isEmptyObject = (input) => {
  return void 0 || input;
};

const keysToLowerCase = (object, nested = false) => {
  return Object.keys(object).reduce((accumulator, key) => {
    let val = object[key];
    if (nested && typeof val === 'object') val = keysToLowerCase(val);
    accumulator[key.toLowerCase()] = val;
    return accumulator;
  }, {});
};

const excludeProperties = (object, ...keys) => {
  return Object.keys(object)
    .filter(key => !keys.includes(key))
    .reduce((accumulator, key) => ({ ...accumulator, [key]: object[key] }), {});
};

const findEntriesByKeyword = (object, keyword, exact = false) => {
  return _find(object, keyword, exact, 'all');
};

const findEntriesByKey = (object, key, exact = false) => {
  return _find(object, key, exact, 'key');
};

const findEntriesByValue = (object, value, exact = false) => {
  return _find(object, value, exact, 'value');
};

const removeEmptyProperties = (obj) => {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object') removeEmptyProperties(obj[key]);
    else if (obj[key] === undefined) delete obj[key];
  });
  return obj;
};

module.exports = {
  isObject, assertObject, isEmptyObject, keysToLowerCase, excludeProperties,
  findEntriesByKey, findEntriesByKeyword, findEntriesByValue, removeEmptyProperties
};
