const Injector = require('../injector');

const _runPreInjections = (moduleId, originalArgs, _this) => {
  const injections = Injector.injections.filter(i => i.module === moduleId && i.pre);
  if (injections.length === 0) {
    return originalArgs;
  }
  return Injector._runPreInjectionsRecursive(injections, originalArgs, _this);
};

module.exports = _runPreInjections;
