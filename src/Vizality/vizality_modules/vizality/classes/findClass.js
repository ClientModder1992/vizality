/* eslint-disable no-unused-vars */

const { logger: { log, error } } = require('vizality/util');

const _traverse = require('./_traverse');
const classes = require('../classes'); // Used in eval below

const findClass = (targetValue, exact = false) => {
  const MODULE = 'Module';
  const SUBMODULE = 'Classes:findClass';

  if (typeof targetValue !== 'string' || targetValue.trim() === '') {
    return error(MODULE, SUBMODULE, null, `Expected a 'string' argument but received '${typeof targetValue}'.`);
  }

  let results = [ ..._traverse(targetValue, exact) ];

  const tempResults = [ ...results ];
  const longestResult = tempResults.sort((a, b) => b.length - a.length)[0];
  const resultsText = results && results.length === 1 ? 'result' : 'results';
  const choiceWord = exact ? 'matching' : 'containing';

  if (!results || !results.length) {
    return log(MODULE, SUBMODULE, null, `${results.length} ${resultsText} found for classes ${choiceWord} '${targetValue}':`);
  }

  log(MODULE, SUBMODULE, null, `${results.length} ${resultsText} found for classes ${choiceWord} '${targetValue}':`);

  if (exact) {
    results = results.map(result => result).join('\n');
  } else {
    results = results.map(result => {
      const resultArray = result.split('.');
      let outputResult = classes;

      for (const result of resultArray) {
        outputResult = outputResult[result];
      }

      return `${result.padEnd(longestResult.length, ' ')} | ${outputResult}`;
    }).join('\n');
  }

  return console.log(results);
};

module.exports = findClass;
