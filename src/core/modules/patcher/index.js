/* eslint-disable no-unused-vars */
/**
 * Patcher that can patch other functions and components allowing you to run code before
 * or after the original function. Can also alter arguments and return values.
 * @module patcher
 */

import { randomBytes } from 'crypto';

import { log, warn, error } from '@vizality/util/logger';
import { getCaller } from '@vizality/util/file';

/** @private */
const _labels = [ 'Module', 'Patcher' ];
const _log = (labels, ...message) => log({ labels: labels || _labels, message });
const _warn = (labels, ...message) => warn({ labels: labels || _labels, message });
const _error = (labels, ...message) => error({ labels: labels || _labels, message });

/**
 * All currently applied patches.
 */
let patches = [];

/**
 * 
 * @param {*} moduleId 
 * @param {*} originalArgs 
 * @param {*} originalReturn 
 * @param {*} _this 
 * @returns 
 */
export const _runPatches = (moduleId, originalArgs, originalReturn, _this) => {
  try {
    let finalReturn = originalReturn;
    const _patches = patches.filter(p => p.module === moduleId && !p.pre);
    _patches.forEach(p => finalReturn = p.method.call(_this, originalArgs, finalReturn));
    return finalReturn;
  } catch (err) {
    return _error(_labels.concat('_runPatches'), err);
  }
};

/**
 * 
 * @param {*} patches 
 * @param {*} originalArgs 
 * @param {*} _this 
 * @returns 
 */
export const _runPrePatchesRecursive = (patches, originalArgs, _this) => {
  try {
    const patch = patches.pop();
    const args = patch.method.call(_this, originalArgs);
    if (args === false) {
      return false;
    }
    if (!Array.isArray(args)) {
      throw new Error(`Pre-patch "${patch.id}" returned something invalid. Patch will be ignored.`);
    }
    if (patches.length > 0) {
      return _runPrePatchesRecursive(patches, args, _this);
    }
    return args;
  } catch (err) {
    return _error(_labels.concat('_runPrePatchesRecursive'), err);
  }
};

/**
 * 
 * @param {*} moduleId 
 * @param {*} originalArgs 
 * @param {*} _this 
 * @returns 
 */
export const _runPrePatches = (moduleId, originalArgs, _this) => {
  try {
    const _patches = patches.filter(p => p.module === moduleId && p.pre);
    if (_patches.length === 0) {
      return originalArgs;
    }
    return _runPrePatchesRecursive(_patches, originalArgs, _this);
  } catch (err) {
    return _error(_labels.concat('_runPrePatches'), err);
  }
};

/**
 * Patches a function.
 * @param {string} patchId Patch ID, used for manually unpatching
 * @param {object} moduleToPatch Module we should inject into
 * @param {string} func Name of the function we're aiming at
 * @param {Function} patch Function to patch
 * @param {boolean} pre Whether the injection should run before original code or not
 */
export const patch = (patchId, moduleToPatch, func, patch, pre = false) => {
  try {
    if (patches.find(patch => patch.id === patchId)) {
      throw new Error(`Patch ID "${patchId}" is already used!`);
    }
    if (!moduleToPatch) {
      throw new Error(`Patch ID "${patchId}" tried to patch a module, but it was undefined!`);
    }
    if (!moduleToPatch[func]) {
      throw new Error(`Patch ID "${patchId}" tried to patch a function, but it was undefined!`);
    }
    if (typeof moduleToPatch[func] !== 'function') {
      throw new Error(`Patch ID "${patchId}" tried to patch a function, but found ${typeof _oldMethod} instead of a function!`);
    }
    const caller = getCaller();
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
          return _error(_labels.concat('patch'), err);
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
    return _error(_labels.concat('patch'), err);
  }
};

/**
 * Checks if a patch by a given ID is applied.
 * @param {string} patchId Patch ID
 */
export const isPatched = patchId => {
  try {
    return patches.some(patch => patch.id === patchId);
  } catch (err) {
    return _error(_labels.concat('isPatched'), err);
  }
};

/**
 * 
 * @param {*} filter 
 * @returns 
 */
export const getPatch = filter => {
  try {

  } catch (err) {
    return _error(_labels.concat('getPatch'), err);
  }
};

/**
 * Gets all active patches by an addon.
 * @param {string} filter Filter to 
 */
export const getPatches = filter => {
  try {
    
  } catch (err) {
    return _error(_labels.concat('getPatches'), err);
  }
};

/**
 * Gets all currently active patches.
 * @returns {Array<?patches>} Array of patches
 */
export const getAllPatches = () => {
  try {
    return patches;
  } catch (err) {
    return _error(_labels.concat('getAllPatches'), err);
  }
};

/**
 * Gets all active patches by an addon.
 * @param {string} addonId Addon ID
 */
export const getPatchesByAddon = addonId => {
  try {
    return patches.filter(patch => patch.caller === addonId);
  } catch (err) {
    return _error(_labels.concat('getPatchesByAddon'), err);
  }
};

/**
 * Removes a patch.
 * @param {string} patchId Patch ID
 */
export const unpatch = patchId => {
  try {
    patches = patches.filter(patch => patch.id !== patchId);
  } catch (err) {
    return _error(_labels.concat('unpatch'), err);
  }
};

/**
 * Removes all applied patches.
 */
export const unpatchAll = () => {
  try {
    patches = [];
  } catch (err) {
    return _error(_labels.concat('unpatchAll'), err);
  }
};

/**
 * Removes all patches created by a given addon.
 * @param {string} addonId Addon ID
 */
export const unpatchAllByAddon = addonId => {
  try {
    patches = patches.filter(patch => patch.caller !== addonId);
  } catch (err) {
    return _error(_labels.concat('unpatchAllByAddon'), err);
  }
};
