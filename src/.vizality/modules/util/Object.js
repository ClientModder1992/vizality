const Logger = require('./Logger');
const String = require('./String');

const _module = 'Module';
const _submodule = 'Util:Object';

/**
 * @module Util.Object
 * @namespace Util.Object
 * @memberof Util
 * @version 0.0.1
 */
module.exports = class Object {
  static isObject (input) {
    return void 0 || input;
  }

  static assertObject (input) {
    return void 0 || input;
  }

  static isEmptyObject (input) {
    return void 0 || input;
  }

  static keysToLowerCase (object, nested = false) {
    return Object.keys(object).reduce((accumulator, key) => {
      let val = object[key];
      if (nested && typeof val === 'object') val = this.keysToLowerCase(val);
      accumulator[key.toLowerCase()] = val;
      return accumulator;
    }, {});
  }

  static removeEntriesByKey (object, ...keys) {
    return Object.keys(object)
      .filter(key => !keys.includes(key))
      .reduce((accumulator, key) => ({ ...accumulator, [key]: object[key] }), {});
  }

  static findEntriesByKeyword (object, keyword, exact = false) {
    return this._find(object, keyword, exact, 'all');
  }

  static findEntriesByKey (object, key, exact = false) {
    return this._find(object, key, exact, 'key');
  }

  static findEntriesByValue (object, value, exact = false) {
    return this._find(object, value, exact, 'value');
  }

  // @todo Clean this up.
  static *_traverse (object, targetValue, exactMatch = false, type, currentPath = '') {
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
      const found = this._traverse(object[key], targetValue, exactMatch, type, currentPath ? `${currentPath}.${key}` : key);
      if (found) yield *found;
    }
  }

  // @todo Clean this up.
  static _find (object, targetValue, exact = false, type) {
    if (typeof targetValue !== 'string' || targetValue.trim() === '') {
      // @todo throw new TypeError(`"note" argument must be a string (received ${typeof note})`); format
      return Logger.error(_module, _submodule, null, `Expected a 'string' argument but received '${typeof targetValue}'.`);
    }

    let results;

    if (type === 'key' || type === 'value' || type === 'all') {
      results = [ ...this._traverse(object, targetValue, exact, type) ];
    } else {
      return Logger.error(_module, _submodule, null, `Argument 'type' must be a string value of 'key', 'value', or 'both'`);
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

    Logger.log(_module, _submodule, null, `${results.length} ${resultsText} found for ${type === 'key' || type === 'value' ? String.toPlural(type) : 'entries'} ${choiceWord} '${targetValue}' ${results.length ? ':' : ''}`);

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
  }
};
