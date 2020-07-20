const Patcher = require('../patcher');

/**
 * Check if a function is patched
 * @param {String} patchId The patch to check
 */
const isPatched = (patchId) => {
  Patcher.patches.some(i => i.id === patchId);
};

module.exports = isPatched;
