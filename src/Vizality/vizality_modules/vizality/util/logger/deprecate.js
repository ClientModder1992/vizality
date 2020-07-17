const warn = require('./warn');

/**
 * Logs a warning message to let the user know the method is deprecated.
 *
 * @param {string} module - Name of the calling module.
 * @param {string} submodule - Message to have logged.
 * @param {string} replacement - Message to have logged.
 */
const deprecate = (module, submodule, replacement) => {
  const message = [
    `${submodule} is deprecated in Vizality.`,
    replacement && `We recommend you use ${replacement} instead.`
  ].filter(Boolean).join(' ');

  return warn(module, submodule, null, message);
};

module.exports = deprecate;
