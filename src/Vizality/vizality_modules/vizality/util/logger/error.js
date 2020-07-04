const logger = require('../logger');

/**
 * Logs an error using a collapsed error group with stacktrace.
 *
 * @param {string} module - Name of the calling module.
 * @param {string} message - Message or error to have logged.
 */
module.exports = (module, submodule, submoduleColor, ...message) => {
  return logger._log(module, submodule, submoduleColor, message, 'error');
};
