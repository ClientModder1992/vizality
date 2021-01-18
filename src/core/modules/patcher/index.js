/* eslint-disable consistent-this */
import { randomBytes } from 'crypto';

import { error } from '@vizality/util/logger';

const _module = 'Module';
const _submodule = 'Patcher';

export let patches = [];

export const _runPatches = (moduleId, originalArgs, originalReturn, _this) => {
  let finalReturn = originalReturn;
  const _patches = patches.filter(i => i.module === moduleId && !i.pre);
  _patches.forEach(i => {
    try {
      finalReturn = i.method.call(_this, originalArgs, finalReturn);
    } catch (err) {
      error(_module, `${_submodule}:_runPatches`, null, `Failed to run patch "${i.id}"!`, err);
    }
  });
  return finalReturn;
};

export const _runPrePatches = (moduleId, originalArgs, _this) => {
  const _patches = patches.filter(i => i.module === moduleId && i.pre);
  if (_patches.length === 0) {
    return originalArgs;
  }
  return this._runPrePatchesRecursive(_patches, originalArgs, _this);
};

export const _runPrePatchesRecursive = (patches, originalArgs, _this) => {
  const patch = patches.pop();
  let args = patch.method.call(_this, originalArgs);
  if (args === false) {
    return false;
  }

  if (!Array.isArray(args)) {
    error(_module, `${_submodule}:_runPrePatchesRecursive`, null, `Pre-patch "${patch.id}" returned something invalid. Patch will be ignored.`);
    args = originalArgs;
  }

  if (patches.length > 0) {
    return this._runPrePatchesRecursive(patches, args, _this);
  }
  return args;
};

/**
 * Check if a function is patched
 * @param {string} patchId The patch to check
 */
export const isPatched = patchId => {
  patches.some(i => i.id === patchId);
};

/**
 * Patches a function
 * @param {string} patchId ID of the patch, used for uninjecting
 * @param {object} moduleToPatch Module we should inject into
 * @param {string} func Name of the function we're aiming at
 * @param {Function} patch Function to patch
 * @param {boolean} pre Whether the injection should run before original code or not
 * @returns {void}
 */
export const patch = (patchId, moduleToPatch, func, patch, pre = false) => {
  if (!moduleToPatch) {
    return error(_module, `${_submodule}:patch`, null, `Tried to patch undefined patch ID "${patchId}"!`);
  }

  if (patches.find(i => i.id === patchId)) {
    return error(_module, `${_submodule}:patch`, null, `Patch ID "${patchId}" is already used!`);
  }

  if (!moduleToPatch.__vizalityPatchId || !moduleToPatch.__vizalityPatchId[func]) {
    // 1st patch
    const id = randomBytes(16).toString('hex');
    moduleToPatch.__vizalityPatchId = Object.assign((moduleToPatch.__vizalityPatchId || {}), { [func]: id });
    moduleToPatch[`__vizalityOriginal_${func}`] = moduleToPatch[func]; // To allow easier debugging
    const _oldMethod = moduleToPatch[func];
    const _this = this;
    moduleToPatch[func] = function (...args) {
      const finalArgs = _this._runPrePatches(id, args, this);
      if (finalArgs !== false && Array.isArray(finalArgs)) {
        const returned = _oldMethod ? _oldMethod.call(this, ...finalArgs) : void 0;
        return _this._runPatches(id, finalArgs, returned, this);
      }
    };
    // Reassign displayName, defaultProps etc etc, not to mess with other plugins
    Object.assign(moduleToPatch[func], _oldMethod);
    // Allow code search even after patching
    moduleToPatch[func].toString = (...args) => _oldMethod.toString(...args);

    patches[id] = [];
  }

  patches.push({
    module: moduleToPatch.__vizalityPatchId[func],
    id: patchId,
    method: patch,
    pre
  });
};

/**
 * Removes an patch
 * @param {string} patchId The patch specified during injection
 */
export const unpatch = (patchId) => {
  patches = patches.filter(i => i.id !== patchId);
};
