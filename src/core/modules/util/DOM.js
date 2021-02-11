/* eslint-disable no-unused-vars */
import { nativeImage } from 'electron';

import { log, warn, error } from './Logger';
import { getModule } from '../webpack';
import { sleep } from './Time';

/**
 * Contains methods relating to the DOM.
 * @module util.dom
 * @namespace util.dom
 * @memberof util
 */

const _module = 'Util';
const _submodule = 'DOM';

/** @private */
const _log = (...data) => log({ module: _module, submodule: _submodule }, ...data);
const _warn = (...data) => warn({ module: _module, submodule: _submodule }, ...data);
const _error = (...data) => error({ module: _module, submodule: _submodule }, ...data);

export const createElement = (type, props) => {
  const element = document.createElement(type);
  for (const prop in props) {
    if ([ 'style', 'href' ].includes(prop) || prop.startsWith('vz-')) {
      element.setAttribute(prop, props[prop]);
    } else {
      element[prop] = props[prop];
    }
  }
  return element;
};

export const waitForElement = async (querySelector, all = false) => {
  let element;
  while (!(element = document.querySelector(querySelector))) await sleep(1);

  if (all) {
    return document.querySelectorAll(querySelector);
  }

  return element;
};

export const getElementDimensions = node => {
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
};

export const setCSSCustomProperty = (varName, value, element = document.body) => {
  return element.style.setProperty(`--${varName}`, value);
};

export const getCSSCustomProperty = (varName, element = document.documentElement) => {
  return getComputedStyle(element).getPropertyValue(`--${varName}`);
};

export const injectShadowStyles = (shadowRootElement, insertBeforeSelector, styles) => {
  const root = shadowRootElement.shadowRoot;

  if (root !== null) {
    const styleElements = root.querySelectorAll('style');

    if (!Array.from(styleElements).some(el => el.innerHTML === styles)) {
      const newStyleTag = document.createElement('style');
      newStyleTag.innerHTML = styles;
      root.insertBefore(newStyleTag, root.querySelector(insertBeforeSelector));
    }
  }
};

export const injectStyles = () => {
  // @todo
};

export const injectScript = () => {
  // @todo
};

/**
 * A simple utility for conditionally joining class names together.
 * @see {@link https://github.com/JedWatson/classnames}
 * @param {string|object|Array} items Potential class names we're trying to join
 * @returns {string} String of class names joined together
 */
export const joinClassNames = (...items) => {
  const classes = [];
  for (const item of items) {
    if (!item) continue;
    const argType = typeof item;
    if (argType === 'string' || argType === 'number') {
      classes.push(item);
    } else if (Array.isArray(item)) {
      if (item.length) {
        const inner = this.joinClassNames.apply(null, item);
        if (inner) classes.push(inner);
      }
    } else if (argType === 'object') {
      if (item.toString !== Object.prototype.toString) {
        classes.push(item.toString());
      } else {
        for (const key in item) {
          if (item.hasOwnProperty(key) && item[key]) {
            classes.push(key);
          }
        }
      }
    }
  }
  return classes.join(' ');
};

// @todo Figure out why this isn't working for Windows users.
export const captureElement = async selector => {
  return (await (() => {
    const getSources = getModule('DesktopSources', 'default').default;
    const mediaEngine = getModule('getMediaEngine').getMediaEngine();
    async function capture (selector) {
      const el = document.querySelector(selector);
      const elRect = el.getBoundingClientRect();
      const sources = await getSources(mediaEngine, [ 'window' ], { width: window.outerWidth, height: window.outerHeight });
      const discord = sources.find(src => src.name === `${document.title} - Discord` || src.name === 'Discord');
      const img = nativeImage.createFromDataURL(discord.url);
      return img.crop(elRect);
    }

    return capture(selector);
  })()).toDataURL();
};

