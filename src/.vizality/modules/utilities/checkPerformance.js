const { log, error } = require('./logger');

/**
 * A simple utility to get gauge the performance
 * of presented blocks of code.
 * @param {string} testCases Test case
 * @returns {undefined} Returns log information in console
 */
const checkPerformance = async (...testCases) => {
  const _module = 'Module';
  const _submodule = 'Utilities:checkPerformance';

  if (arguments.length === 0) {
    return error(_module, _submodule, null, 'You must supply at least 1 test case.');
  }

  const outcome = {};

  let caseNumber = 0;

  // Set up and run the test case
  for (const test of testCases) {
    caseNumber++;

    const before = performance.now();
    await eval(test);
    const after = performance.now();

    const time = parseFloat((after - before).toFixed(4)).toString().replace(/^0+/, '');

    log(_module, _submodule, null, `Case #${caseNumber} took ${time} ms.`);

    outcome[caseNumber] = time;
  }

  // No need to do the following code block if there's only 1 argument
  if (testCases.length === 1) return;

  const winner = Object.entries(outcome).sort((current, next) => current[1] - next[1])[0];
  const secondPlace = Object.entries(outcome).sort((current, next) => current[1] - next[1])[1];
  const winningTime = winner[1];
  const secondPlaceTime = secondPlace[1];

  // Limit the result to 4 decimal places and remove any leading zeroes
  const timeDifference = parseFloat((secondPlaceTime - winningTime).toFixed(4)).toString().replace(/^0+/, '');

  // Convert difference to a percentage and limit the result to decimal places
  const percentPerformanceGain = parseFloat(((timeDifference / winningTime) * 100).toFixed(2));

  return log(_module, _submodule, null, `Case #${winner[0]} is the winner with a time of ${winningTime} ms. That's ${percentPerformanceGain}% faster than second place!`);
};

module.exports = checkPerformance;
