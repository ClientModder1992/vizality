const { logger : { error } } = require('vizality/util');

const Injector = require('../injector');

const _runInjections = (moduleId, originalArgs, originalReturn, _this) => {
  const MODULE = 'Module';
  const SUBMODULE = 'Injector';

  let finalReturn = originalReturn;
  const injections = Injector.injections.filter(i => i.module === moduleId && !i.pre);
  injections.forEach(i => {
    try {
      finalReturn = i.method.call(_this, originalArgs, finalReturn);
    } catch (e) {
      error(MODULE, SUBMODULE, null, `Failed to run injection '${i.id}'.`, e);
    }
  });
  return finalReturn;
};

module.exports = _runInjections;
