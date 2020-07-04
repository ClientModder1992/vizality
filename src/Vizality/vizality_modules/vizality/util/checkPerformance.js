const { log, warn } = require('./logger');

module.exports = (...cases) => {
  const MODULE = 'Module';
  const SUBMODULE = 'Util:checkPerformance';

  if (cases.length < 2) {
    return warn(MODULE, SUBMODULE, null, 'You must enter at least 2 code segments in the form of strings separated by a comma, which shall then be matched against each other in a race of performance.');
  }

  const outcome = {};

  for (const testCase of cases) {
    const caseNumber = cases.indexOf(testCase) + 1;

    const before = performance.now();
    eval(testCase);
    const after = performance.now();

    const time = parseFloat((after - before).toFixed(4)).toString().replace(/^0+/, '');

    log(MODULE, SUBMODULE, null, `Case #${caseNumber} took ${time} ms.`);

    outcome[caseNumber] = time;
  }

  const winner = Object.entries(outcome).sort((current, next) => current[1] - next[1])[0];
  const secondPlace = Object.entries(outcome).sort((current, next) => current[1] - next[1])[1];
  const winningTime = winner[1];
  const secondPlaceTime = secondPlace[1];

  const timeDifference = parseFloat((secondPlaceTime - winningTime).toFixed(4)).toString().replace(/^0+/, '');

  const percentPerformanceGain = parseFloat(((timeDifference / winningTime) * 100).toFixed(2));

  return log(MODULE, SUBMODULE, null, `Case #${winner[0]} is the winner with a time of ${winningTime} ms. That's ${percentPerformanceGain}% faster than second place!`);
};
