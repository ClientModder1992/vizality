/**
 * @deprecated:
 * @powercord: This function/module is only here to provide
 * backwards-compatability with Powercord plugins that may utilize it.
 *
 * Plugins should be using `Util.string.toCamelCase` instead.
 */

const string = require('./string');
const logger = require('./logger');

const camelCaseify = (str) => {
  const MODULE = 'Module';
  const SUBMODULE = 'Util:camelCaseify';
  const REPLACEMENT_SUBMODULE = 'Util:string:toCamelCase';

  logger.deprecate(MODULE, SUBMODULE, REPLACEMENT_SUBMODULE);

  return string.toCamelCase(str);
};

module.exports = camelCaseify;
