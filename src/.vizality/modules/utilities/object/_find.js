const { log, error } = require('../logger');
const { toPlural } = require('../string');
const _traverse = require('./_traverse');

const _find = (object, targetValue, exact = false, type) => {
  const module = 'Module';
  const submodule = `Util:object:${
    type === 'key'
      ? 'findEntriesByKey'
      : type === 'value'
        ? 'findEntriesByValue'
        : type === 'all'
          ? 'findEntries'
          : '_find'}`;

  if (typeof targetValue !== 'string' || targetValue.trim() === '') {
    // @todo throw new TypeError(`"note" argument must be a string (received ${typeof note})`); format
    return error(module, submodule, null, `Expected a 'string' argument but received '${typeof targetValue}'.`);
  }

  let results;

  if (type === 'key' || type === 'value' || type === 'all') {
    results = [ ..._traverse(object, targetValue, exact, type) ];
  } else {
    return error(module, submodule, null, `Argument 'type' must be a string value of 'key', 'value', or 'both'`);
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

  log(module, submodule, null, `${results.length} ${resultsText} found for ${type === 'key' || type === 'value' ? toPlural(type) : 'entries'} ${choiceWord} '${targetValue}' ${results.length ? ':' : ''}`);

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

module.exports = _find;
