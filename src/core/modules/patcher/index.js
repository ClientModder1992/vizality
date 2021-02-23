/* eslint-disable no-unused-vars */
import { randomBytes } from 'crypto';

import { log, warn, error } from '@vizality/util/logger';
import { getCaller } from '@vizality/util/file';

/**
 * @module patcher
 * @namespace patcher
 */

/** @private */
const _module = 'Module';
const _submodule = 'Patcher';
const _log = (...message) => log({ module: _module, submodule: _submodule, message });
const _warn = (...message) => warn({ module: _module, submodule: _submodule, message });
const _error = (...message) => error({ module: _module, submodule: _submodule, message });

let patches = [];

export const _runPatches = (moduleId, originalArgs, originalReturn, _this) => {
  try {
    let finalReturn = originalReturn;
    const _patches = patches.filter(i => i.module === moduleId && !i.pre);
    _patches.forEach(i => {
      try {
        finalReturn = i.method.call(_this, originalArgs, finalReturn);
      } catch (err) {
        return _error(`Failed to run patch "${i.id}"!`, err);
      }
    });
    return finalReturn;
  } catch (err) {
    return _error(err);
  }
};

export const _runPrePatchesRecursive = (patches, originalArgs, _this) => {
  try {
    const patch = patches.pop();
    let args = patch.method.call(_this, originalArgs);
    if (args === false) {
      return false;
    }

    if (!Array.isArray(args)) {
      _error(`Pre-patch "${patch.id}" returned something invalid. Patch will be ignored.`);
      args = originalArgs;
    }

    if (patches.length > 0) {
      return _runPrePatchesRecursive(patches, args, _this);
    }
    return args;
  } catch (err) {
    return _error(err);
  }
};

export const _runPrePatches = (moduleId, originalArgs, _this) => {
  try {
    const _patches = patches.filter(i => i.module === moduleId && i.pre);
    if (_patches.length === 0) {
      return originalArgs;
    }
    return _runPrePatchesRecursive(_patches, originalArgs, _this);
  } catch (err) {
    return _error(err);
  }
};

/**
 * Patches a function
 * @param {string} patchId ID of the patch, used for uninjecting
 * @param {object} moduleToPatch Module we should inject into
 * @param {string} func Name of the function we're aiming at
 * @param {Function} patch Function to patch
 * @param {boolean} pre Whether the injection should run before original code or not
 */
export const patch = (patchId, moduleToPatch, func, patch, pre = false) => {
  try {
    const caller = getCaller();
    if (!moduleToPatch) {
      throw new Error(`Patch ID "${patchId}" tried to patch an undefined module!`);
    }

    if (typeof moduleToPatch[func] !== 'function') {
      throw new Error(`Patch ID "${patchId}" tried to patch a module that's not a function.`);
    }

    if (patches.find(i => i.id === patchId)) {
      throw new Error(`Patch ID "${patchId}" is already used!`);
    }

    if (!moduleToPatch.__vizalityPatchId || !moduleToPatch.__vizalityPatchId[func]) {
      // First patch
      const id = randomBytes(16).toString('hex');
      moduleToPatch.__vizalityPatchId = Object.assign((moduleToPatch.__vizalityPatchId || {}), { [func]: id });
      moduleToPatch[`__vizalityOriginal_${func}`] = moduleToPatch[func]; // To allow easier debugging
      const _oldMethod = moduleToPatch[func];
      moduleToPatch[func] = function (...args) {
        try {
          const finalArgs = _runPrePatches(id, args, this);
          if (finalArgs !== false && Array.isArray(finalArgs)) {
            const returned = _oldMethod ? _oldMethod.call(this, ...finalArgs) : void 0;
            return _runPatches(id, finalArgs, returned, this);
          }
        } catch (err) {
          return _error(err);
        }
      };
      // Reassign displayName, defaultProps, etc., so it doesn't mess with other plugins
      Object.assign(moduleToPatch[func], _oldMethod);
      // Allow code search even after patching
      moduleToPatch[func].toString = (...args) => _oldMethod.toString(...args);
    }

    patches.push({
      caller,
      module: moduleToPatch.__vizalityPatchId[func],
      id: patchId,
      method: patch,
      pre
    });
  } catch (err) {
    return _error(err);
  }
};

/**
 * Checks if a function is patched.
 * @param {string} patchId The patch to check
 */
export const isPatched = patchId => {
  try {
    return patches.some(i => i.id === patchId);
  } catch (err) {
    return _error(err);
  }
};

/**
 * Gets all active patches.
 */
export const getPatches = () => {
  try {
    return patches;
  } catch (err) {
    return _error(err);
  }
};

/**
 * Gets all active patches by an addon.
 * @param {string} addonId Addon ID
 */
export const getPatchesByAddon = addonId => {
  try {
    return patches.filter(i => i.caller !== addonId);
  } catch (err) {
    return _error(err);
  }
};

/**
 * Removes a patch.
 * @param {string} patchId Patch ID
 */
export const unpatch = patchId => {
  try {
    patches = patches.filter(i => i.id !== patchId);
  } catch (err) {
    return _error(err);
  }
};

/**
 * Removes all patches.
 */
export const unpatchAll = () => {
  try {
    patches = [];
  } catch (err) {
    return _error(err);
  }
};

/**
 * Removes all patches by an addon.
 * @param {string} addonId Patch ID
 */
export const unpatchAllByAddon = addonId => {
  try {
    patches = patches.filter(i => i.caller !== addonId);
  } catch (err) {
    return _error(err);
  }
};
