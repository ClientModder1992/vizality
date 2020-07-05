/**
 * @deprecated:
 * @powercord: This function/module is only here to provide
 * backwards-compatability with Powercord plugins that may utilize it.
 *
 * Plugins should be using `Util.dom.createElement` instead.
 */

const logger = require('./logger');

const createElement = (name, props) => {
  const MODULE = 'Module';
  const SUBMODULE = 'Util:createElement';
  const REPLACEMENT_SUBMODULE = 'Util:dom:createElement';

  logger.deprecate(MODULE, SUBMODULE, REPLACEMENT_SUBMODULE);

  const element = document.createElement(name);

  for (const prop in props) {
    // noinspection JSUnfilteredForInLoop
    if ([ 'style', 'href' ].includes(prop) || prop.startsWith('data-')) {
      // noinspection JSUnfilteredForInLoop
      element.setAttribute(prop, props[prop]);
    } else {
      // noinspection JSUnfilteredForInLoop
      element[prop] = props[prop];
    }
  }

  return element;
};

module.exports = createElement;
