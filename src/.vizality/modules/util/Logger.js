const Color = require('./Color');

/**
 * @module Util.Logger
 * @namespace Util.Logger
 * @memberof Util
 * @version 0.0.1
 */
module.exports = class Logger {
  static get types () { return [ 'log', 'warn', 'error', 'deprecate' ]; }

  static get badgeColors () {
    return {
      api: {
        module: '#dc2167',
        submodule: '#242a85'
      },
      core: {
        module: '#591870',
        submodule: '#ce03e5'
      },
      http: {
        module: '#e63200',
        submodule: '#2e89c9'
      },
      manager: {
        module: '#1e2963',
        submodule: '#782049'
      },
      plugin: {
        module: '#057b81',
        submodule: '#5b3c89'
      },
      theme: {
        module: '#e23773',
        submodule: '#568763'
      },
      discord: {
        module: '#7289DA',
        submodule: '#d6409a'
      },
      module: {
        module: '#ed7c6f',
        submodule: '#34426e'
      },
      patch: {
        module: '#a70338',
        submodule: '#0195b5'
      }
    };
  }

  static _parseType (type) {
    return this.types.find(t => t === type) || 'log';
  }

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
  static _log (module, submodule, submoduleLabelColor, message, type) {
    type = this._parseType(type);

    if (!Array.isArray(message)) message = [ message ];

    module = module.toLowerCase();
    submodule = submodule.toLowerCase();

    const randomModuleColor = Color.getRandomColor();
    const randomSubmoduleLabelColor = Color.getRandomColor();

    const baseBadgeStyles = `border-radius: 3px; text-align: center; display: inline-block; font-family: Arial, "Helvetica Neue", Helvetica, sans-serif; text-transform: uppercase; font-size: 10px; font-weight: 600; line-height: 14px; margin-right: 3px; padding: 1px 4px;`;

    const badgeStyles = `background-image: url(https://i.imgur.com/t0eWy67.png); background-repeat: no-repeat; background-position: center; background-size: contain; padding: 2px 14px 5px 0; border-radius: 5px; text-align: center; margin: 0 4px 1px 0; display: inline-block;`;

    const moduleStyles =
      `${baseBadgeStyles}
      color: ${this.badgeColors[module] && this.badgeColors[module].module ? Color.getContrastedColor(this.badgeColors[module].module) : Color.getContrastedColor(randomModuleColor)};
      background: ${this.badgeColors[module] && this.badgeColors[module].module || randomModuleColor};`;

    const submoduleStyles =
      `${baseBadgeStyles};
      color: ${submoduleLabelColor ? Color.getContrastedColor(submoduleLabelColor) : this.badgeColors[module] && this.badgeColors[module].submodule ? Color.getContrastedColor(this.badgeColors[module].submodule) : Color.getContrastedColor(randomSubmoduleLabelColor)};
      background: ${submoduleLabelColor || this.badgeColors[module] && this.badgeColors[module].submodule || randomSubmoduleLabelColor};`;

    return console[type](
      `%c %c${module}%c${submodule}`,
      badgeStyles,
      moduleStyles,
      submoduleStyles,
      ...message
    );
  }

  /**
   * Log used for basic logging.
   * @param {string} module The name of the calling module
   * @param {string} submodule The name of the calling submodule
   * @param {string} submoduleLabelColor The name of the calling submodule
   * @param {*|Array<*>} message The messages to have logged
   * @returns {void}
   */
  static log (module, submodule, submoduleLabelColor, ...message) {
    return this._log(module, submodule, submoduleLabelColor, message);
  }

  /**
   * Logs a warning message.
   * @param {string} module The name of the calling module
   * @param {string} submodule The name of the calling submodule
   * @param {string} submoduleLabelColor The name of the calling submodule
   * @param {*|Array<*>} message The messages to have logged
   * @returns {void}
   */
  static warn (module, submodule, submoduleLabelColor, ...message) {
    return this._log(module, submodule, submoduleLabelColor, message, 'warn');
  }

  /**
   * Logs an error using a collapsed error group with stacktrace.
   * @param {string} module The name of the calling module
   * @param {string} submodule The name of the calling submodule
   * @param {string} submoduleLabelColor The name of the calling submodule
   * @param {*|Array<*>} message The messages to have logged
   * @returns {void}
   */
  static error (module, submodule, submoduleLabelColor, ...message) {
    return this._log(module, submodule, submoduleLabelColor, message, 'error');
  }

  /**
   * Logs a warning message to let the user know something is deprecated.
   * @param {string} module The name of the calling module
   * @param {string} submodule The name of the calling submodule
   * @param {string} submoduleLabelColor The name of the calling submodule
   * @param {*|Array<*>} message The messages to have logged
   * @returns {void}
   */
  static deprecate (module, submodule, submoduleLabelColor, ...message) {
    return this._log(module, submodule, submoduleLabelColor, `Deprecation Notice: ${message}`, 'warn');
  }
};
