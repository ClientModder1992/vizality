const _log = require('./_log');

/**
 * Log used for basic logging.
 *
 * @param {string} module - Name of the calling module.
 * @param {string} submodule - Name of the calling submodule.
 * @param {...any} message - Messages to have logged.
 */
const log = (module, submodule, submoduleColor, ...message) => {
  return _log(module, submodule, submoduleColor, message);
};

module.exports = log;
