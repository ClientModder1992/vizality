const _log = require('./_log');

/**
 * Logs a warning message.
 *
 * @param {string} module - Name of the calling module.
 * @param {...any} message - Messages to have logged.
 */
const warn = (module, submodule, submoduleColor, ...message) => {
  return _log(module, submodule, submoduleColor, message, 'warn');
};

module.exports = warn;
