/**
 * @hack: Figure out why const { getModule } = require('vizality/webpack') doesn't work.
 */

let joinClassNamesModule;

const joinClassNames = (...args) => {
  if (!joinClassNamesModule) joinClassNamesModule = require('vizality/webpack').getModule(e => e.default && e.default.default, false);

  return joinClassNamesModule(...args);
};

module.exports = joinClassNames;
