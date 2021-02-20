/* eslint-disable no-unused-vars */
import { getRandomColor, getContrastColor, blendColors, shadeColor } from './Color';
import { assertObject } from './Object';
import { isArray } from './Array';

/**
 * Contains methods that output stylized log messages to developer tools console.
 * @module util.logger
 * @namespace util.logger
 * @memberof util
 */

/** @private */
const _module = 'Util';
const _submodule = 'Logger';
const _log = (...message) => this.log({ module: _module, submodule: _submodule, message });
const _warn = (...message) => this.warn({ module: _module, submodule: _submodule, message });
const _error = (...message) => this.error({ module: _module, submodule: _submodule, message });

const _parseType = type => {
  const types = [ 'log', 'warn', 'error' ];
  return types.find(t => t === type) || 'log';
};

export const modules = {
  api: { module: '#dc2167', submodule: '#242a85' },
  core: { module: '#591870', submodule: '#ce03e5' },
  http: { module: '#e63200', submodule: '#2e89c9' },
  manager: { module: '#9ee945', submodule: '#782049' },
  builtin: { module: '#267366', submodule: '#fff' },
  plugin: { module: '#42ffa7', submodule: '#594bda' },
  theme: { module: '#b68aff', submodule: '#f3523d' },
  discord: { module: '#7289da', submodule: '#18191c' },
  module: { module: '#ed7c6f', submodule: '#34426e' },
  patch: { module: '#a70338', submodule: '#0195b5' },
  watcher: { module: '#fcff8d', submodule: '#963b8a' },
  component: { module: '#162a2e', submodule: '#e58ede' }
  // #9a3c4e
};

/**
 * Logs strings using different console levels, includes a badge, module label,
 * submodule label, and message.
 * @param {string} module Name of the calling module
 * @param {string} submodule Name of the calling submodule
 * @param {string} submoduleLabelColor Name of the calling submodule
 * @param {*|Array<*>} message Messages to have logged
 * @param {string} type Type of log to use in console
 */
const _logHandler = (properties) => {
  try {
    let { module, submodule, subsubmodule, moduleColor, submoduleColor, subsubmoduleColor, type, message } = properties;

    type = _parseType(type);

    // If message isn't an array, turn it into one so we can process them all the same
    if (!isArray(message)) message = [ message ];

    module = module?.toLowerCase();
    submodule = submodule?.toLowerCase();
    subsubmodule = subsubmodule?.toLowerCase();

    moduleColor = moduleColor || this.modules[module]?.module || getRandomColor();
    submoduleColor = submoduleColor || this.modules[module]?.submodule || getRandomColor();
    subsubmoduleColor = subsubmoduleColor || this.modules[module]?.subsubmodule || blendColors(moduleColor, submoduleColor, 0.75);

    const baseBadgeStyles = `
      display: inline-block;
      text-align: center;
      border-radius: 2px;
      font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
      text-transform: uppercase;
      font-size: 10px;
      font-weight: 600;
      line-height: 14px;
      margin-right: 3px;
      padding: 1px 4px;`;

    const badgeStyles = `
      display: inline-block;
      background-image: url('vz-asset://image/logo.png');
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
      border-radius: 2px;
      text-align: center;
      padding: 2px 14px 5px 0;
      margin: 0 4px 1px 0;`;

    const moduleStyles =
      `${baseBadgeStyles}
      color: ${getContrastColor(moduleColor)};
      background: ${moduleColor};`;

    const submoduleStyles =
      `${baseBadgeStyles};
      color: ${getContrastColor(submoduleColor)};
      background: ${submoduleColor};`;

    const subsubmoduleStyles =
      `${baseBadgeStyles};
      color: ${getContrastColor(subsubmoduleColor)};
      background: ${subsubmoduleColor};`;

    if (subsubmodule) {
      return console[type](
        `%c %c${module}%c${submodule}%c${subsubmodule}`,
        badgeStyles,
        moduleStyles,
        submoduleStyles,
        subsubmoduleStyles,
        ...message
      );
    }

    return console[type](
      `%c %c${module}%c${submodule}`,
      badgeStyles,
      moduleStyles,
      submoduleStyles,
      ...message
    );
  } catch (err) {
    _error(err);
  }
};

/**
 * Logs an informational message to dev tools console.
 * @param {object} properties Properties for the log
 * @param {string} properties.module Text for the main module label
 * @param {string} properties.submodule Text for the submodule label
 * @param {string} properties.subsubmodule Text for the subsubmodule label
 * @param {string} [properties.submoduleLabelColor] The name of the calling submodule
 * @param {*|Array<*>} [properties.message] The messages to have logged
 * @returns {void}
 */
export const log = properties => {
  assertObject(properties);
  properties.type = 'log';
  return _logHandler(properties);
};

/**
 * Logs a warning message to dev tools console.
 * @param {string} module The name of the calling module
 * @param {string} submodule The name of the calling submodule
 * @param {string} submoduleLabelColor The name of the calling submodule
 * @param {*|Array<*>} message The messages to have logged
 * @returns {void}
 */
export const warn = properties => {
  assertObject(properties);
  properties.type = 'warn';
  return _logHandler(properties);
};

/**
 * Logs an error message to dev tools console.
 * @param {string} module The name of the calling module
 * @param {string} submodule The name of the calling submodule
 * @param {string} submoduleLabelColor The name of the calling submodule
 * @param {*|Array<*>} message The messages to have logged
 * @returns {void}
 */
export const error = properties => {
  assertObject(properties);
  properties.type = 'error';
  return _logHandler(properties);
};

/**
 * Logs a warning message to let the user know something is deprecated.
 * @param {string} module The name of the calling module
 * @param {string} submodule The name of the calling submodule
 * @param {string} submoduleLabelColor The name of the calling submodule
 * @param {*|Array<*>} message The messages to have logged
 * @returns {void}
 */
export const deprecate = properties => {
  assertObject(properties);
  properties.type = 'warn';
  properties.message = `Deprecation Notice: ${properties.message}`;
  return _logHandler(properties);
};
