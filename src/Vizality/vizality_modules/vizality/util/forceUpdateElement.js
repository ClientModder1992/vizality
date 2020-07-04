/**
 * @deprecated:
 * @powercord: This function/module is only here to provide
 * backwards-compatability with Powercord plugins that may utilize it.
 *
 * Plugins should be using `react.forceUpdateElement` instead.
 */

const getOwnerInstance = require('./getOwnerInstance');

module.exports = (query, all = false) => {
  const elements = all ? [ ...document.querySelectorAll(query) ] : [ document.querySelector(query) ];
  elements.filter(Boolean).forEach(element => {
    getOwnerInstance(element).forceUpdate();
  });
};
