const Injector = require('../injector');

/**
 * Removes an injection
 * @param {String} injectionId The injection specified during injection
 */
const uninject = (injectionId) => {
  Injector.injections = Injector.injections.filter(i => i.id !== injectionId);
};

module.exports = uninject;
