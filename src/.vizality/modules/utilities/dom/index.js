const sleep = require('../sleep');

/**
 * @module util.dom
 * @namespace util.dom
 * @memberof util
 * @version 0.0.1
 */
const createElement = (type, props) => {
  const element = document.createElement(type);
  for (const prop in props) {
    if ([ 'style', 'href' ].includes(prop) || prop.startsWith('data-')) {
      element.setAttribute(prop, props[prop]);
    } else {
      element[prop] = props[prop];
    }
  }
  return element;
};

const waitForElement = async (querySelector) => {
  let element;
  // @todo: Consider reworking this code... As it stands, if the element doesn't exist, it just keeps running forever...
  while (!(element = document.querySelector(querySelector))) await sleep(1);
  return element;
};

module.exports = { createElement, waitForElement };