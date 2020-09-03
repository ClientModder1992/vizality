const { logger : { error } } = require('@utilities');

const { randomBytes } = require('crypto');

const Patcher = require('../patcher');

/**
 * Patches a function
 * @param {String} patchId ID of the patch, used for uninjecting
 * @param {object} moduleToPatch Module we should inject into
 * @param {String} func Name of the function we're aiming at
 * @param {function} patch Function to patch
 * @param {Boolean} pre Whether the injection should run before original code or not
 */
const patch = (patchId, moduleToPatch, func, patch, pre = false) => {
  const module = 'Module';
  const submodule = 'Patcher:patch';

  if (!moduleToPatch) {
    return error(module, submodule, null, `Tried to patch undefined (patch ID '${patchId}').`);
  }

  if (Patcher.patches.find(i => i.id === patchId)) {
    return error(module, submodule, null, `Patch ID '${patchId}' is already used!`);
  }

  if (!moduleToPatch.__vizalityPatchId || !moduleToPatch.__vizalityPatchId[func]) {
    // 1st patch
    const id = randomBytes(16).toString('hex');
    moduleToPatch.__vizalityPatchId = Object.assign((moduleToPatch.__vizalityPatchId || {}), { [func]: id });
    moduleToPatch[`__vizalityOriginal_${func}`] = moduleToPatch[func]; // To allow easier debugging
    const _oldMethod = moduleToPatch[func];
    moduleToPatch[func] = function (...args) {
      const finalArgs = Patcher._runPrePatches(id, args, this);
      if (finalArgs !== false && Array.isArray(finalArgs)) {
        const returned = _oldMethod ? _oldMethod.call(this, ...finalArgs) : void 0;
        return Patcher._runPatches(id, finalArgs, returned, this);
      }
    };
    // Reassign displayName, defaultProps etc etc, not to mess with other plugins
    Object.assign(moduleToPatch[func], _oldMethod);
    // Allow code search even after patching
    moduleToPatch[func].toString = (...args) => _oldMethod.toString(...args);

    Patcher.patches[id] = [];
  }

  Patcher.patches.push({
    module: moduleToPatch.__vizalityPatchId[func],
    id: patchId,
    method: patch,
    pre
  });
};

module.exports = patch;
