const { logger : { error } } = require('@util');

const Injector = require('../injector');

const _runPreInjectionsRecursive = (injections, originalArgs, _this) => {
  const MODULE = 'Module';
  const SUBMODULE = 'Injector';

  const injection = injections.pop();
  let args = injection.method.call(_this, originalArgs);
  if (args === false) {
    return false;
  }

  if (!Array.isArray(args)) {
    error(MODULE, SUBMODULE, null, `Pre-injection ${injection.id} returned something invalid. Injection will be ignored.`);
    args = originalArgs;
  }

  if (injections.length > 0) {
    return Injector._runPreInjectionsRecursive(injections, args, _this);
  }
  return args;
};

module.exports = _runPreInjectionsRecursive;
