const { logger : { error } } = require('@util');

const Patcher = require('../patcher');

const _runPatches = (moduleId, originalArgs, originalReturn, _this) => {
  const MODULE = 'Module';
  const SUBMODULE = 'Patcher';

  let finalReturn = originalReturn;
  const patches = Patcher.patches.filter(i => i.module === moduleId && !i.pre);
  patches.forEach(i => {
    try {
      finalReturn = i.method.call(_this, originalArgs, finalReturn);
    } catch (e) {
      error(MODULE, SUBMODULE, null, `Failed to run patch '${i.id}'.`, e);
    }
  });
  return finalReturn;
};

module.exports = _runPatches;
