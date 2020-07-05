/**
 * @deprecated:
 * @powercord: This function/module is only here to provide
 * backwards-compatability with Powercord plugins that may utilize it.
 *
 * Plugins should be using `Util.react.getOwnerInstance` instead.
 */

const getReactInstance = require('./getReactInstance');
const logger = require('./logger');

const getOwnerInstance = (node) => {
  const MODULE = 'Module';
  const SUBMODULE = 'Util:getOwnerInstance';
  const REPLACEMENT_SUBMODULE = 'Util:react:getOwnerInstance';

  logger.deprecate(MODULE, SUBMODULE, REPLACEMENT_SUBMODULE);

  for (let curr = getReactInstance(node); curr; curr = curr.return) {
    const owner = curr.stateNode;
    if (owner && !(owner instanceof HTMLElement)) {
      return owner;
    }
  }

  return null;
};

module.exports = getOwnerInstance;
