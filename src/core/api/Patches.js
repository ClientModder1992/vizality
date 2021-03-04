/**
 * The patches API allows you to "patch" other functions and components, letting you to run code before
 * or after the original function. Can also alter arguments and return values.
 * @module Patches
 * @memberof API
 * @namespace API.Patches
 * @version 1.0.0
 */

import { getCaller } from '@vizality/util/file';
import { API } from '@vizality/entities';
import { randomBytes } from 'crypto';

/**
 * All currently active patches.
 * Accessed with `getAllPatches` below.
 */
let patches = [];

/**
 * @extends API
 * @extends Events
 */
export default class Patches extends API {
  /**
   * Shuts down the API, removing all listeners and stored objects.
   */
  stop () {
    try {
      this.unregisterAllPatches();
      delete vizality.api.patches;
      this.removeAllListeners();
    } catch (err) {
      return this.error('There was an error unloading the Patches API!', err);
    }
  }

  /**
   * 
   * @param {*} moduleId 
   * @param {*} originalArgs 
   * @param {*} originalReturn 
   * @param {*} _this 
   * @returns 
   */
  _runPatches (moduleId, originalArgs, originalReturn, _this) {
    try {
      let finalReturn = originalReturn;
      const _patches = patches.filter(p => p.module === moduleId && !p.pre);
      _patches.forEach(p => {
        try {
          finalReturn = p.method.call(_this, originalArgs, finalReturn);
        } catch (err) {
          return p.method.call(_this, originalArgs, originalReturn);
        }
      });
      // console.log('finalReturn', finalReturn);
      // console.log('originalReturn', originalReturn);
      return finalReturn || originalReturn;
    } catch (err) {
      return _error(_labels.concat('_runPatches'), err);
    }
  }

  /**
   * 
   * @param {*} patches 
   * @param {*} originalArgs 
   * @param {*} _this 
   * @returns 
   */
  _runPrePatchesRecursive (patches, originalArgs, _this) {
    try {
      const patch = patches.pop();
      let args;
      try {
        args = patch.method.call(_this, originalArgs);
      } catch (err) {
        _error(_labels.concat('_runPrePatchesRecursive'), err);
        return originalArgs;
      }
      if (args === false) return false;
      if (!Array.isArray(args)) return originalArgs;
      if (patches.length > 0) return _runPrePatchesRecursive(patches, args, _this);
      return args;
    } catch (err) {
      return _error(_labels.concat('_runPrePatchesRecursive'), err);
    }
  }

  /**
   * 
   * @param {*} moduleId 
   * @param {*} originalArgs 
   * @param {*} _this 
   * @returns 
   */
  _runPrePatches (moduleId, originalArgs, _this) {
    try {
      const _patches = patches.filter(p => p.module === moduleId && p.pre);
      if (_patches.length === 0) {
        return originalArgs;
      }
      return _runPrePatchesRecursive(_patches, originalArgs, _this) || originalArgs;
    } catch (err) {
      return _error(_labels.concat('_runPrePatches'), err);
    }
  }

  /**
   * Patches a function.
   * @param {string} patchId Patch ID, used for manually unpatching
   * @param {object} moduleToPatch Module we should inject into
   * @param {string} func Name of the function we're aiming at
   * @param {Function} patch Function to patch
   * @param {boolean} pre Whether the injection should run before original code or not
   */
  patch (patchId, moduleToPatch, func, patch, pre = false) {
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
  }

  /**
   * Checks if a patch by a given ID is applied.
   * @param {string} patchId Patch ID
   */
  isPatched (patchId) {
    try {
      return patches.some(patch => patch.id === patchId);
    } catch (err) {
      return _error(_labels.concat('isPatched'), err);
    }
  }

  /**
   * 
   * @param {*} filter 
   * @returns 
   */
  getPatch (filter) {
    try {

    } catch (err) {
      return _error(_labels.concat('getPatch'), err);
    }
  }

  /**
   * Gets all active patches by an addon.
   * @param {string} filter Filter to 
   */
  getPatches (filter) {
    try {
      
    } catch (err) {
      return _error(_labels.concat('getPatches'), err);
    }
  }

  /**
   * Gets all currently active patches.
   * @returns {Array<?patches>} Array of patches
   */
  getAllPatches () {
    try {
      return patches;
    } catch (err) {
      return _error(_labels.concat('getAllPatches'), err);
    }
  }

  /**
   * Gets all active patches by an addon.
   * @param {string} addonId Addon ID
   */
  getPatchesByAddon (addonId) {
    try {
      return patches.filter(patch => patch.caller === addonId);
    } catch (err) {
      return _error(_labels.concat('getPatchesByAddon'), err);
    }
  }

  /**
   * Removes a patch.
   * @param {string} patchId Patch ID
   */
  unpatch (patchId) {
    try {
      patches = patches.filter(patch => patch.id !== patchId);
    } catch (err) {
      return _error(_labels.concat('unpatch'), err);
    }
  }

  /**
   * Removes all applied patches.
   */
  unpatchAll () {
    try {
      patches = [];
    } catch (err) {
      return this.error(_labels.concat('unpatchAll'), err);
    }
  }

  /**
   * Removes all patches created by a given addon.
   * @param {string} addonId Addon ID
   */
  unpatchAllByAddon (addonId) {
    try {
      patches = patches.filter(patch => patch.caller !== addonId);
    } catch (err) {
      return _error(_labels.concat('unpatchAllByAddon'), err);
    }
  }
}
