/**
 * @deprecated:
 * @powercord: This function/module is only here to provide
 * backwards-compatability with Powercord plugins that may utilize it.
 *
 * Plugins should be using `string.camelCase` instead.
 */

const { string } = require('vizality/util');

module.exports = (str) => {
  string.camelCase(str);
  console.warn('camelCaseify is depcrated in Vizality. We recommend you use `string.camelCase` instead.');
};

