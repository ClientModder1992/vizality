const { logger : { error } } = require('@util');

const Patcher = require('../patcher');

const _runPatches = (moduleId, originalArgs, originalReturn, _this) => {
  const module = 'Module';
  const submodule = 'Patcher';

  let finalReturn = originalReturn;
  const patches = Patcher.patches.filter(i => i.module === moduleId && !i.pre);
  patches.forEach(i => {
    try {
      finalReturn = i.method.call(_this, originalArgs, finalReturn);
    } catch (e) {
      error(module, submodule, null, `Failed to run patch '${i.id}'.`, e);
    }
  });
  return finalReturn;
};

module.exports = _runPatches;
