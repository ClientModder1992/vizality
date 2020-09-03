const Patcher = require('../patcher');

/**
 * Removes an patch
 * @param {String} patchId The patch specified during injection
 */
const unpatch = (patchId) => {
  Patcher.patches = Patcher.patches.filter(i => i.id !== patchId);
};

module.exports = unpatch;
