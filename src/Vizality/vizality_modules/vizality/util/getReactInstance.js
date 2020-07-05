/**
 * @deprecated:
 * @powercord: This function/module is only here to provide
 * backwards-compatability with Powercord plugins that may utilize it.
 *
 * Plugins should be using `Util.react.getReactInstance` instead.
 */

const logger = require('./logger');

const getReactInstance = (node) => {
  const MODULE = 'Module';
  const SUBMODULE = 'Util:getReactInstance';
  const REPLACEMENT_SUBMODULE = 'Util:react:getReactInstance';

  logger.deprecate(MODULE, SUBMODULE, REPLACEMENT_SUBMODULE);

  if (!node) return null;
  if (!Object.keys(node) || !Object.keys(node).length) return null;
  const reactInternalInstanceKey = Object.keys(node).find(key => key.startsWith('__reactInternalInstance'));
  return reactInternalInstanceKey ? node[reactInternalInstanceKey] : null;
};

module.exports = getReactInstance;
