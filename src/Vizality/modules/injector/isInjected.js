const Injector = require('@injector');

/**
 * Check if a function is injected
 * @param {String} injectionId The injection to check
 */
const isInjected = (injectionId) => {
  Injector.injections.some(i => i.id === injectionId);
};

module.exports = isInjected;
