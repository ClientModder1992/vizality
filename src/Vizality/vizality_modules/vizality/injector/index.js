const { randomBytes } = require('crypto');

const injector = {
  injections: [],

  /**
   * Injects into a function
   * @param {String} injectionId ID of the injection, used for uninjecting
   * @param {object} moduleToPatch Module we should inject into
   * @param {String} functionName Name of the function we're aiming at
   * @param {function} patch Function to inject
   * @param {Boolean} pre Whether the injection should run before original code or not
   */
  inject: (injectionId, moduleToPatch, functionName, patch, pre = false) => {
    if (!moduleToPatch) {
      return injector._error(`Tried to patch undefined (Injection ID "${injectionId}")`);
    }

    if (injector.injections.find(i => i.id === injectionId)) {
      return injector._error(`Injection ID "${injectionId}" is already used!`);
    }

    if (!moduleToPatch.__vizalityInjectionId || !moduleToPatch.__vizalityInjectionId[functionName]) {
      // 1st injection
      const id = randomBytes(16).toString('hex');
      moduleToPatch.__vizalityInjectionId = Object.assign((moduleToPatch.__vizalityInjectionId || {}), { [functionName]: id });
      moduleToPatch[`__vizalityOriginal_${functionName}`] = moduleToPatch[functionName]; // To allow easier debugging
      const _oldMethod = moduleToPatch[functionName];
      moduleToPatch[functionName] = function (...args) {
        const finalArgs = injector._runPreInjections(id, args, this);
        if (finalArgs !== false && Array.isArray(finalArgs)) {
          const returned = _oldMethod ? _oldMethod.call(this, ...finalArgs) : void 0;
          return injector._runInjections(id, finalArgs, returned, this);
        }
      };
      // Reassign displayName, defaultProps etc etc, not to mess with other plugins
      Object.assign(moduleToPatch[functionName], _oldMethod);
      // Allow code search even after patching
      moduleToPatch[functionName].toString = (...args) => _oldMethod.toString(...args);

      injector.injections[id] = [];
    }

    injector.injections.push({
      module: moduleToPatch.__vizalityInjectionId[functionName],
      id: injectionId,
      method: patch,
      pre
    });
  },

  /**
   * Removes an injection
   * @param {String} injectionId The injection specified during injection
   */
  uninject: (injectionId) => {
    injector.injections = injector.injections.filter(i => i.id !== injectionId);
  },

  /**
   * Check if a function is injected
   * @param {String} injectionId The injection to check
   */
  isInjected: (injectionId) => injector.injections.some(i => i.id === injectionId),

  _runPreInjections: (moduleId, originalArgs, _this) => {
    const injections = injector.injections.filter(i => i.module === moduleId && i.pre);
    if (injections.length === 0) {
      return originalArgs;
    }
    return injector._runPreInjectionsRecursive(injections, originalArgs, _this);
  },

  _runPreInjectionsRecursive: (injections, originalArgs, _this) => {
    const injection = injections.pop();
    let args = injection.method.call(_this, originalArgs);
    if (args === false) {
      return false;
    }

    if (!Array.isArray(args)) {
      injector._error(`Pre-injection ${injection.id} returned something invalid. Injection will be ignored.`);
      args = originalArgs;
    }

    if (injections.length > 0) {
      return injector._runPreInjectionsRecursive(injections, args, _this);
    }
    return args;
  },

  _runInjections: (moduleId, originalArgs, originalReturn, _this) => {
    let finalReturn = originalReturn;
    const injections = injector.injections.filter(i => i.module === moduleId && !i.pre);
    injections.forEach(i => {
      try {
        finalReturn = i.method.call(_this, originalArgs, finalReturn);
      } catch (e) {
        injector._error(`Failed to run injection "${i.id}"`, e);
      }
    });
    return finalReturn;
  },

  _error: (...args) => {
    console.error('%c[Vizality:Injector]', 'color: #7289da', ...args);
  }
};

/** @module vizality/injector */
module.exports = injector;
