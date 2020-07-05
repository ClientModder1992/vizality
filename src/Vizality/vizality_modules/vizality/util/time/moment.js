/**
 * @hack: Figure out why const { getModule } = require('vizality/webpack') doesn't work.
 */

let momentModule;

const moment = (...args) => {
  if (!momentModule) momentModule = require('vizality/webpack').getModule([ 'createFromInputFallback' ], false);

  return momentModule(...args);
};

module.exports = moment;
