/**
 * @deprecated:
 * @powercord: This function/module is only here to provide
 * backwards-compatability with Powercord plugins that may utilize it.
 *
 * Plugins should be using `Util.react.forceUpdateElement` instead.
 */

const getOwnerInstance = require('./getOwnerInstance');
const logger = require('./logger');

const forceUpdateElement = (query, all = false) => {
  const MODULE = 'Module';
  const SUBMODULE = 'Util:forceUpdateElement';
  const REPLACEMENT_SUBMODULE = 'Util:react:forceUpdateElement';

  logger.deprecate(MODULE, SUBMODULE, REPLACEMENT_SUBMODULE);

  const elements = all ? [ ...document.querySelectorAll(query) ] : [ document.querySelector(query) ];

  return elements.filter(Boolean).forEach(element => {
    getOwnerInstance(element).forceUpdate();
  });
};

module.exports = forceUpdateElement;
