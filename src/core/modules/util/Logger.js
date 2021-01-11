import { HTTP } from '@vizality/constants';

import { getRandomColor, getContrastedColor } from './Color';

/**
 * @module util.logger
 * @namespace util.logger
 * @memberof util
 * @version 0.0.1
 */

export const _parseType = type => {
  const types = [ 'log', 'warn', 'error', 'deprecate' ];
  return types.find(t => t === type) || 'log';
};

/**
 * Logs strings using different console levels, includes a badge, module label,
 * submodule label, and message.
 * @param {string} module Name of the calling module
 * @param {string} submodule Name of the calling submodule
 * @param {string} submoduleLabelColor Name of the calling submodule
 * @param {*|Array<*>} message Messages to have logged
 * @param {string} type Type of log to use in console
 * @returns {void}
 */
export const _log = (module, submodule, submoduleLabelColor, message, type) => {
  const badgeColors = {
    api: { module: '#dc2167', submodule: '#242a85' },
    core: { module: '#591870', submodule: '#ce03e5' },
    http: { module: '#e63200', submodule: '#2e89c9' },
    manager: { module: '#1e2963', submodule: '#782049' },
    builtin: { module: '#267366', submodule: '#fff' },
    plugin: { module: '#42ffa7', submodule: '#594bda' },
    theme: { module: '#b68aff', submodule: '#f3523d' },
    discord: { module: '#7289da', submodule: '#18191c' },
    module: { module: '#ed7c6f', submodule: '#34426e' },
    patch: { module: '#a70338', submodule: '#0195b5' },
    watcher: { module: '#631323', submodule: '#fcff8d' }
  };

  type = this._parseType(type);

  if (!Array.isArray(message)) message = [ message ];

  module = module.toLowerCase();
  submodule = submodule.toLowerCase();

  const randomModuleColor = getRandomColor();
  const randomSubmoduleLabelColor = getRandomColor();

  const baseBadgeStyles = `border-radius: 2px; text-align: center; display: inline-block; font-family: Arial, "Helvetica Neue", Helvetica, sans-serif; text-transform: uppercase; font-size: 10px; font-weight: 600; line-height: 14px; margin-right: 3px; padding: 1px 4px;`;

  const badgeStyles = `background-image: url('vz-asset://images/console-icon.png'); background-repeat: no-repeat; background-position: center; background-size: contain; border-radius: 2px; padding: 2px 14px 5px 0; text-align: center; margin: 0 4px 1px 0; display: inline-block;`;

  const moduleStyles =
    `${baseBadgeStyles}
    color: ${badgeColors[module] && badgeColors[module].module ? getContrastedColor(badgeColors[module].module) : getContrastedColor(randomModuleColor)};
    background: ${badgeColors[module] && badgeColors[module].module || randomModuleColor};`;

  const submoduleStyles =
    `${baseBadgeStyles};
    color: ${submoduleLabelColor ? getContrastedColor(submoduleLabelColor) : badgeColors[module] && badgeColors[module].submodule ? getContrastedColor(badgeColors[module].submodule) : getContrastedColor(randomSubmoduleLabelColor)};
    background: ${submoduleLabelColor || badgeColors[module] && badgeColors[module].submodule || randomSubmoduleLabelColor};`;

  return console[type](
    `%c %c${module}%c${submodule}`,
    badgeStyles,
    moduleStyles,
    submoduleStyles,
    ...message
  );
};

/**
 * Log used for basic logging.
 * @param {string} module The name of the calling module
 * @param {string} submodule The name of the calling submodule
 * @param {string} submoduleLabelColor The name of the calling submodule
 * @param {*|Array<*>} message The messages to have logged
 * @returns {void}
 */
export const log = (module, submodule, submoduleLabelColor, ...message) => {
  return this._log(module, submodule, submoduleLabelColor, message);
};

/**
 * Logs a warning message.
 * @param {string} module The name of the calling module
 * @param {string} submodule The name of the calling submodule
 * @param {string} submoduleLabelColor The name of the calling submodule
 * @param {*|Array<*>} message The messages to have logged
 * @returns {void}
 */
export const warn = (module, submodule, submoduleLabelColor, ...message) => {
  return this._log(module, submodule, submoduleLabelColor, message, 'warn');
};

/**
 * Logs an error using a collapsed error group with stacktrace.
 * @param {string} module The name of the calling module
 * @param {string} submodule The name of the calling submodule
 * @param {string} submoduleLabelColor The name of the calling submodule
 * @param {*|Array<*>} message The messages to have logged
 * @returns {void}
 */
export const error = (module, submodule, submoduleLabelColor, ...message) => {
  return this._log(module, submodule, submoduleLabelColor, message, 'error');
};

/**
 * Logs a warning message to let the user know something is deprecated.
 * @param {string} module The name of the calling module
 * @param {string} submodule The name of the calling submodule
 * @param {string} submoduleLabelColor The name of the calling submodule
 * @param {*|Array<*>} message The messages to have logged
 * @returns {void}
 */
export const deprecate = (module, submodule, submoduleLabelColor, ...message) => {
  return this._log(module, submodule, submoduleLabelColor, `Deprecation Notice: ${message}`, 'warn');
};
