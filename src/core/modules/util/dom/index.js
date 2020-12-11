/* eslint-disable no-unused-vars */
const sleep = require('../sleep');

/**
 * @module util.dom
 * @namespace util.dom
 * @memberof util
 * @version 0.0.1
 */
const dom = module.exports = {
  createElement (type, props) {
    const element = document.createElement(type);
    for (const prop in props) {
      if ([ 'style', 'href' ].includes(prop) || prop.startsWith('vz-')) {
        element.setAttribute(prop, props[prop]);
      } else {
        element[prop] = props[prop];
      }
    }
    return element;
  },

  async waitForElement (querySelector, all = false) {
    let element;
    // @todo: Consider reworking this code... As it stands, if the element doesn't exist, it just keeps running forever...
    while (!(element = document.querySelector(querySelector))) await sleep(1);

    if (all) {
      return document.querySelectorAll(querySelector);
    }

    return element;
  },

  getElementDimensions (node) {
    let widthList = [ 'margin-right', 'margin-left', 'border-right', 'border-left', 'padding-right', 'padding-left', 'width' ];
    let heightList = [ 'margin-top', 'margin-bottom', 'border-top', 'border-bottom', 'padding-top', 'padding-bottom', 'height' ];
    const style = window.getComputedStyle(node);

    if (style.getPropertyValue('box-sizing') === 'border-box') {
      widthList = [ 'margin-right', 'margin-left', 'width' ];
      heightList = [ 'margin-top', 'margin-bottom', 'height' ];
    }

    const width = widthList
      .map(k => parseInt(style.getPropertyValue(k)))
      .reduce((prev, cur) => prev + cur);
    const height = heightList
      .map(k => parseInt(style.getPropertyValue(k)))
      .reduce((prev, cur) => prev + cur);

    return { width, height };
  },

  injectShadowStyles (shadowRootElement, insertBeforeSelector, styles) {
    const root = shadowRootElement.shadowRoot;

    if (root !== null) {
      const styleElements = root.querySelectorAll('style');

      if (!Array.from(styleElements).some(el => el.innerHTML === styles)) {
        const newStyleTag = document.createElement('style');
        newStyleTag.innerHTML = styles;
        root.insertBefore(newStyleTag, root.querySelector(insertBeforeSelector));
      }
    }
  }
};
