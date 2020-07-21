const Patcher = require('../patcher');

const _runPrePatches = (moduleId, originalArgs, _this) => {
  const patches = Patcher.patches.filter(i => i.module === moduleId && i.pre);
  if (patches.length === 0) {
    return originalArgs;
  }
  return Patcher._runPrePatchesRecursive(patches, originalArgs, _this);
};

module.exports = _runPrePatches;
