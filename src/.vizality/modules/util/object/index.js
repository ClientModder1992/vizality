const { log, error } = require('../logger');
const { toPlural } = require('../string');

const _module = 'Module';
const _submodule = 'Util:Object';

/**
 * @module util.object
 * @namespace util.object
 * @memberof util
 * @version 0.0.1
 */
const object = module.exports = {
  // @todo Clean this up.
  *_traverse (obj, targetValue, exactMatch = false, type, currentPath = '') {
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
      const found = object._traverse(obj[key], targetValue, exactMatch, type, currentPath ? `${currentPath}.${key}` : key);
      if (found) yield *found;
    }
  },

  // @todo Clean this up.
  _find (obj, targetValue, exact = false, type) {
    if (typeof targetValue !== 'string' || targetValue.trim() === '') {
      // @todo throw new TypeError(`"note" argument must be a string (received ${typeof note})`); format
      return error(_module, `${_submodule}:_find`, null, `Expected a string argument but received ${typeof targetValue}'.`);
    }

    let results;

    if (type === 'key' || type === 'value' || type === 'all') {
      results = [ ...object._traverse(obj, targetValue, exact, type) ];
    } else {
      return error(_module, `${_submodule}:_find`, null, `Argument "type" must be a string value of "key", "value", or "both"`);
    }

    const tempResults = [ ...results ];
    const longestResult = tempResults.sort((a, b) => b.length - a.length)[0];
    const resultsText = results && results.length === 1 ? 'result' : 'results';
    const choiceWord = exact ? 'matching' : 'containing';

    /*
     * @todo This needs reworking somehow. It is bugged for objects which contain
     * keys with period(s) in them.
     */
    log(_module, `${_submodule}:_find`, null, `${results.length} ${resultsText} found for ${type === 'key' || type === 'value' ? toPlural(type) : 'entries'} ${choiceWord} '${targetValue}' ${results.length ? ':' : ''}`);

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
         * include \n for line breaks in their i18n strings, and if so we want to see them.
         */
        return `${result.padEnd(longestResult.length, ' ')} | ${outputResult.replace(/\n/g, '\\n')}`;
      }).join('\n');
    }

    if (results.length > 0) return console.log(results);
  },

  isObject (input) {
    return typeof input === 'function' || typeof input === 'object' && !!input;
  },

  assertObject (input) {
    return void 0 || input;
  },

  isEmptyObject (input) {
    return void 0 || input;
  },

  keysToLowerCase (obj, nested = false) {
    return Object.keys(obj).reduce((accumulator, key) => {
      let val = obj[key];
      if (nested && typeof val === 'object') val = object.keysToLowerCase(val);
      accumulator[key.toLowerCase()] = val;
      return accumulator;
    }, {});
  },

  excludeProperties (obj, ...keys) {
    return Object.keys(obj)
      .filter(key => !keys.includes(key))
      .reduce((accumulator, key) => ({ ...accumulator, [key]: obj[key] }), {});
  },

  findEntriesByKeyword (obj, keyword, exact = false) {
    return object._find(obj, keyword, exact, 'all');
  },

  findEntriesByKey (obj, key, exact = false) {
    return object._find(obj, key, exact, 'key');
  },

  findEntriesByValue (obj, value, exact = false) {
    return object._find(obj, value, exact, 'value');
  },

  removeEmptyProperties (obj) {
    Object.keys(obj).forEach(key => {
      if (obj[key] && typeof obj[key] === 'object') object.removeEmptyProperties(obj[key]);
      else if (obj[key] === undefined) delete obj[key];
    });
    return obj;
  }
};
