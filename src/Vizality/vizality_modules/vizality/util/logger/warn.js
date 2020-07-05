const logger = require('../logger');

/**
 * Logs a warning message.
 *
 * @param {string} module - Name of the calling module.
 * @param {...any} message - Messages to have logged.
 */
const warn = (module, submodule, submoduleColor, ...message) => {
  return logger._log(module, submodule, submoduleColor, message, 'warn');
};

module.exports = warn;
