const { log, warn } = require('./logger');

const checkPerformance = async (...testCases) => {
  const module = 'Module';
  const submodule = 'Util:checkPerformance';

  if (testCases.length < 1) {
    return warn(module, submodule, null, 'You must enter at least 1 test case in the form of a string.');
  }

  const outcome = {};

  let caseNumber = 0;

  for (const test of testCases) {
    caseNumber++;

    const before = performance.now();
    await eval(test);
    const after = performance.now();

    const time = parseFloat((after - before).toFixed(4)).toString().replace(/^0+/, '');

    log(module, submodule, null, `Case #${caseNumber} took ${time} ms.`);

    outcome[caseNumber] = time;
  }

  // No need to do the following code block if there's only 1 argument
  if (testCases.length === 1) return;

  const winner = Object.entries(outcome).sort((current, next) => current[1] - next[1])[0];
  const secondPlace = Object.entries(outcome).sort((current, next) => current[1] - next[1])[1];
  const winningTime = winner[1];
  const secondPlaceTime = secondPlace[1];

  const timeDifference = parseFloat((secondPlaceTime - winningTime).toFixed(4)).toString().replace(/^0+/, '');

  const percentPerformanceGain = parseFloat(((timeDifference / winningTime) * 100).toFixed(2));

  return log(module, submodule, null, `Case #${winner[0]} is the winner with a time of ${winningTime} ms. That's ${percentPerformanceGain}% faster than second place!`);
};

module.exports = checkPerformance;
