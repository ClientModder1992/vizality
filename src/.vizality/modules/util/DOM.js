const Misc = require('./Misc');

/**
 * @module Util.DOM
 * @namespace Util.DOM
 * @memberof Util
 * @version 0.0.1
 */
module.exports = class DOM {
  static createElement (type, props) {
    const element = document.createElement(type);
    for (const prop in props) {
      if ([ 'style', 'href' ].includes(prop) || prop.startsWith('data-')) {
        element.setAttribute(prop, props[prop]);
      } else {
        element[prop] = props[prop];
      }
    }
    return element;
  }

  static async waitForElement (querySelector) {
    let element;
    // @todo: Consider reworking this code... As it stands, if the element doesn't exist, it just keeps running forever...
    while (!(element = document.querySelector(querySelector))) await Misc.sleep(1);
    return element;
  }
};
