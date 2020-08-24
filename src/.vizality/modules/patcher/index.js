/* eslint-disable consistent-this *//* eslint-disable no-undef */

const Util = require('@util');

const _module = 'Module';
const _submodule = 'Patcher';

module.exports = class Patcher {
  constructor () {
    this.patches = [];
  }

  static _runPatches (moduleId, originalArgs, originalReturn, _this) {
    let finalReturn = originalReturn;
    const patches = this.patches.filter(i => i.module === moduleId && !i.pre);
    patches.forEach(i => {
      try {
        finalReturn = i.method.call(_this, originalArgs, finalReturn);
      } catch (err) {
        Util.Logger.error(_module, _submodule, null, `Failed to run patch '${i.id}'.`, err);
      }
    });
    return finalReturn;
  }

  static _runPrePatches (moduleId, originalArgs, _this) {
    const patches = this.patches.filter(i => i.module === moduleId && i.pre);
    if (patches.length === 0) {
      return originalArgs;
    }
    return this._runPrePatchesRecursive(patches, originalArgs, _this);
  }

  static _runPrePatchesRecursive (patches, originalArgs, _this) {
    const patch = patches.pop();
    let args = patch.method.call(_this, originalArgs);
    if (args === false) {
      return false;
    }

    if (!Util.Array.isArray(args)) {
      Util.Logger.error(_module, _submodule, null, `Pre-patch ${patch.id} returned something invalid. Patch will be ignored.`);
      args = originalArgs;
    }

    if (patches.length > 0) {
      return this._runPrePatchesRecursive(patches, args, _this);
    }
    return args;
  }

  /**
   * Checks if a function is patched.
   * @param {string} patchId Patch to check
   */
  static isPatched (patchId) {
    this.patches.some(i => i.id === patchId);
  }

  /**
   * Patches a function.
   * @param {string} patchId ID of the patch, used for uninjecting
   * @param {Object} moduleToPatch Module we should inject into
   * @param {string} func Name of the function we're aiming at
   * @param {Function} patch Function to patch
   * @param {boolean} pre Whether the injection should run before original code or not
   * @returns {void}
   */
  static patch (patchId, moduleToPatch, func, patch, pre = false) {
    if (!moduleToPatch) {
      return Util.Logger.error(_module, _submodule, null, `Tried to patch undefined (patch ID '${patchId}').`);
    }

    if (this.patches.find(i => i.id === patchId)) {
      return Util.Logger.error(_module, _submodule, null, `Patch ID '${patchId}' is already used!`);
    }

    if (!moduleToPatch.__vizalityPatchId || !moduleToPatch.__vizalityPatchId[func]) {
      // 1st patch
      const id = randomBytes(16).toString('hex');
      moduleToPatch.__vizalityPatchId = Object.assign((moduleToPatch.__vizalityPatchId || {}), { [func]: id });
      moduleToPatch[`__vizalityOriginal_${func}`] = moduleToPatch[func]; // To allow easier debugging
      const _oldMethod = moduleToPatch[func];
      moduleToPatch[func] = function (...args) {
        const finalArgs = this._runPrePatches(id, args, this);
        if (finalArgs !== false && Util.Array.isArray(finalArgs)) {
          const returned = _oldMethod ? _oldMethod.call(this, ...finalArgs) : void 0;
          return this._runPatches(id, finalArgs, returned, this);
        }
      };
      // Reassign displayName, defaultProps etc etc, not to mess with other plugins
      Object.assign(moduleToPatch[func], _oldMethod);
      // Allow code search even after patching
      moduleToPatch[func].toString = (...args) => _oldMethod.toString(...args);

      this.patches[id] = [];
    }

    this.patches.push({
      module: moduleToPatch.__vizalityPatchId[func],
      id: patchId,
      method: patch,
      pre
    });
  }

  /**
   * Removes a patch.
   * @param {string} patchId Patch specified during injection
   */
  static unpatch (patchId) {
    this.patches = this.patches.filter(i => i.id !== patchId);
  }
};
