const logger = require('../logger');

/**
 * Log used for basic logging.
 *
 * @param {string} module - Name of the calling module.
 * @param {string} submodule - Name of the calling submodule.
 * @param {...any} message - Messages to have logged.
 */
const log = (module, submodule, submoduleColor, ...message) => {
  return logger._log(module, submodule, submoduleColor, message);
};

module.exports = log;
