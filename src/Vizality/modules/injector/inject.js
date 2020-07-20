const { logger : { error } } = require('@util');

const { randomBytes } = require('crypto');

const Injector = require('../injector');

/**
 * Injects into a function
 * @param {String} injectionId ID of the injection, used for uninjecting
 * @param {object} moduleToPatch Module we should inject into
 * @param {String} func Name of the function we're aiming at
 * @param {function} patch Function to inject
 * @param {Boolean} pre Whether the injection should run before original code or not
 */
const inject = (injectionId, moduleToPatch, func, patch, pre = false) => {
  const MODULE = 'Module';
  const SUBMODULE = 'Injector:inject';

  if (!moduleToPatch) {
    return error(MODULE, SUBMODULE, null, `Tried to patch undefined (Injection ID '${injectionId}').`);
  }

  if (Injector.injections.find(i => i.id === injectionId)) {
    return error(MODULE, SUBMODULE, null, `Injection ID '${injectionId}' is already used!`);
  }

  if (!moduleToPatch.__vizalityInjectionId || !moduleToPatch.__vizalityInjectionId[func]) {
    // 1st injection
    const id = randomBytes(16).toString('hex');
    moduleToPatch.__vizalityInjectionId = Object.assign((moduleToPatch.__vizalityInjectionId || {}), { [func]: id });
    moduleToPatch[`__vizalityOriginal_${func}`] = moduleToPatch[func]; // To allow easier debugging
    const _oldMethod = moduleToPatch[func];
    moduleToPatch[func] = function (...args) {
      const finalArgs = Injector._runPreInjections(id, args, this);
      if (finalArgs !== false && Array.isArray(finalArgs)) {
        const returned = _oldMethod ? _oldMethod.call(this, ...finalArgs) : void 0;
        return Injector._runInjections(id, finalArgs, returned, this);
      }
    };
    // Reassign displayName, defaultProps etc etc, not to mess with other plugins
    Object.assign(moduleToPatch[func], _oldMethod);
    // Allow code search even after patching
    moduleToPatch[func].toString = (...args) => _oldMethod.toString(...args);

    Injector.injections[id] = [];
  }

  Injector.injections.push({
    module: moduleToPatch.__vizalityInjectionId[func],
    id: injectionId,
    method: patch,
    pre
  });
};

module.exports = inject;
