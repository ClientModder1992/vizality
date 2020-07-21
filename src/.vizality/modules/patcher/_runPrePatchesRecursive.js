const { logger : { error } } = require('@util');

const Patcher = require('../patcher');

const _runPrePatchesRecursive = (patches, originalArgs, _this) => {
  const MODULE = 'Module';
  const SUBMODULE = 'Patcher';

  const patch = patches.pop();
  let args = patch.method.call(_this, originalArgs);
  if (args === false) {
    return false;
  }

  if (!Array.isArray(args)) {
    error(MODULE, SUBMODULE, null, `Pre-patch ${patch.id} returned something invalid. Patch will be ignored.`);
    args = originalArgs;
  }

  if (patches.length > 0) {
    return Patcher._runPrePatchesRecursive(patches, args, _this);
  }
  return args;
};

module.exports = _runPrePatchesRecursive;
