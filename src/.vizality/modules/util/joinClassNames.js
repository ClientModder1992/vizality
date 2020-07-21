/**
 * @hack: Figure out why const { getModule } = require('@webpack') doesn't work.
 */

let joinClassNamesModule;

const joinClassNames = (...args) => {
  if (!joinClassNamesModule) joinClassNamesModule = require('@webpack').getModule(e => e.default && e.default.default);

  return joinClassNamesModule(...args);
};

module.exports = joinClassNames;
