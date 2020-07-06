const warn = require('./warn');

/**
 * Logs a warning message to let the user know the method is deprecated.
 *
 * @param {string} module - Name of the calling module.
 * @param {string} message - Message to have logged.
 */
const deprecate = (module, submodule, replacement) => {
  const message = `${submodule} is deprecated in Vizality.${replacement ? ` We recommend you use ${replacement} instead.` : ''}`;

  return warn(module, submodule, null, message, 'warn');
};

module.exports = deprecate;
