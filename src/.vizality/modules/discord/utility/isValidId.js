const { logger: { error }, string: { toHeaderCase } } = require('@utilities');

/**
 * Checks if the ID is a valid string.
 * @param {string} id - ID
 * @param {string} type - ID descriptor
 * @param {?string} submodule - Submodule
 * @returns {(boolean|undefined)} - Whether or not the ID is a valid string
 */
const isValidId = (id, type, submodule = null) => {
  const _module = 'Module';
  const _submodule = submodule || 'Discord:Utilities:isValidId';

  // Check if the type is a valid string
  if (!type || typeof type !== 'string') {
    return error(_module, _submodule, null, `Type '${type}' is not a valid string.`);
  }

  type = toHeaderCase(type);

  // Check if the ID is a valid string
  if (typeof id !== 'string') {
    return error(_module, _submodule, null, `${type} ID '${id}' is not a valid string.`);
  }

  return true;
};

module.exports = isValidId;
