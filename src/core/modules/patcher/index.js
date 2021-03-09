import { warn, error } from '@vizality/util/logger';
import { getCaller } from '@vizality/util/file';

const _labels = [ 'patcher' ];

export const patches = [];
export const errorLimit = 5;

// eslint-disable-next-line consistent-this
export function runPatches (patches, type, returnValue, _this, args) {
  for (const patch of patches.filter(p => p.type === type)) {
    try {
      const tempReturn = patch.callback.bind(_this)(args, returnValue, _this);

      if (typeof tempReturn !== 'undefined') returnValue = tempReturn;
    } catch (err) {
      error({ labels: _labels.concat('runPatch'), message: [ `Failed to run ${type} callback for ${patch.caller}:\n`, err ] });
      patch.errorsOccurred++;
    }
  }

  return returnValue;
}

export function makeOverride (patch) {
  return function (...args) {
    let returnValue;
    if (!patch.childs.length) return patch.originalFunction.apply(this, args);

    try {
      let tempReturn = runPatches(patch.childs, 'before', returnValue, this, args);

      if (Array.isArray(tempReturn)) args = tempReturn;

      tempReturn = void 0;
      returnValue = patch.originalFunction.apply(this, args);

      tempReturn = runPatches(patch.childs, 'after', returnValue, this, args);

      if (typeof tempReturn !== 'undefined') returnValue = tempReturn;
    } catch (err) {
      error({ labels: _labels, message: [ err ] });
    }

    return returnValue;
  };
}

export function createPatch (caller, moduleToPatch, functionName) {
  const patchData = {
    caller,
    moduleToPatch,
    functionName,
    originalFunction: moduleToPatch[functionName],
    unpatch: () => {
      patchData.moduleToPatch[moduleToPatch.functionName] = patchData.originalFunction;
      patchData.childs = [];
      patches.splice(patchData.index, 1);
    },
    childs: [],
    get count () { return this.childs.length; },
    get index () { return patches.indexOf(this); }
  };

  moduleToPatch[functionName] = makeOverride(patchData);
  Object.assign(moduleToPatch[functionName], patchData.originalFunction);
  moduleToPatch[functionName].toString = () => patchData.originalFunction.toString();
  moduleToPatch[functionName]['__vz-originalFunction'] = patchData.originalFunction;

  patches.push(patchData);

  return patchData;
}

export function patch (...args) {
  if (typeof args[0] !== 'string') args.unshift(getCaller());
  let [ id, moduleToPatch, func, patchFunction, type = 'after', { failSave = true } = {} ] = args;

  if (typeof type === 'boolean') {
    if (type) type = 'before';
    else type = 'after';
  }
  try {
    if (!moduleToPatch) {
      throw new Error(`Patch ID "${id}" tried to patch a module, but it was undefined!`);
    }
    if (!moduleToPatch[func]) {
      throw new Error(`Patch ID "${id}" tried to patch a function, but it was undefined!`);
    }
    if (typeof moduleToPatch[func] !== 'function') {
      throw new Error(`Patch ID "${id}" tried to patch a function, but found ${typeof _oldMethod} instead of a function!`);
    }

    const patchModule = patches.find(e => e.moduleToPatch === moduleToPatch && e.functionName === func) || createPatch(id, moduleToPatch, func);

    const child = {
      callback: patchFunction,
      type,
      moduleToPatch,
      functionName: func,
      unpatch: () => {
        patchModule.childs.splice(patchModule.childs.indexOf(child), 1);
      },
      _errorsOccurred: 0,
      get errorsOccurred () { return this._errorsOccurred; },
      set errorsOccurred (count) {
        if (count >= errorLimit && failSave) {
          this.unpatch();
          warn({ labels: _labels.concat('patch'), message: [ `Automatically unpatched ${type} patch for ${id} because the limit of ${errorLimit} exceptions was reached.` ] });
        }
        this._errorsOccurred = count;
      }
    };

    patchModule.childs.push(child);
    return child.unpatch;
  } catch (err) {
    error({ labels: _labels.concat('patch'), message: err });
  }
}


export function getPatchesByCaller (caller = getCaller()) {
  const found = [];
  for (const patch of patches) for (const child of patch.childs) if (child.caller === caller) found.push(child);
  return found;
}

export function unpatchAll (caller) {
  const patches = getPatchesByCaller(caller);

  for (const patch of patches) patch.unpatch();
}

/** @deprecated */
export const unpatch = unpatchAll;

const Patcher = { patch, patches, unpatchAll, getPatchesByCaller, unpatch };
export default Patcher;
