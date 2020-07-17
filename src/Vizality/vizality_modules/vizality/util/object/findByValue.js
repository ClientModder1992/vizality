/* eslint-disable no-unused-vars */

const { logger: { log, error } } = require('vizality/util');

const _traverseValues = require('./_traverseValues');

const findByValue = (object, targetValue, exact = false) => {
  const MODULE = 'Module';
  const SUBMODULE = 'Util:object:findByValue';

  if (typeof targetValue !== 'string' || targetValue.trim() === '') {
    return error(MODULE, SUBMODULE, null, `Expected a 'string' argument but received '${typeof targetValue}'.`);
  }

  let results = [ ..._traverseValues(object, targetValue, exact) ];

  const tempResults = [ ...results ];
  const longestResult = tempResults.sort((a, b) => b.length - a.length)[0];
  const resultsText = results && results.length === 1 ? 'result' : 'results';
  const choiceWord = exact ? 'matching' : 'containing';

  if (!results || !results.length) {
    return log(MODULE, SUBMODULE, null, `${results.length} ${resultsText} found for values ${choiceWord} '${targetValue}':`);
  }

  log(MODULE, SUBMODULE, null, `${results.length} ${resultsText} found for values ${choiceWord} '${targetValue}':`);

  if (exact) {
    results = results.map(result => result).join('\n');
  } else {
    results = results.map(result => {
      const resultArray = result.split('.');
      let outputResult = object;

      for (const result of resultArray) {
        outputResult = outputResult[result];
      }

      /*
       * We're using replace(/\n/g, '\\n') here particularly because Discord likes to sometimes
       * include \n for line breaks in their i18n strings, and if so we want to see them.
       */
      return `${result.padEnd(longestResult.length, ' ')} | ${outputResult.replace(/\n/g, '\\n')}`;
    }).join('\n');
  }

  return console.log(results);
};

module.exports = findByValue;
