const { logger: { error }, string: { toHeaderCase } } = require('@utilities');

/**
 * Checks if the ID is a string.
 * @param {snowflake} id ID
 * @param {string} type Describes the type of ID
 * @param {?string} [submodule] Submodule
 * @returns {boolean|undefined} Whether the ID is a string
 * @private
 */
const _isValidId = (id, type, submodule) => {
  const _module = 'Module';
  let _submodule = submodule || 'Discord:Utility:isValidId';

  try {
    // Check if the submodule is a string
    if (!_submodule || typeof _submodule !== 'string') {
      _submodule = 'Discord:Utility:isValidId';
      throw new TypeError(`"submodule" argument must be a string (received ${typeof submodule})`);
    }

    // Check if the type is a string
    if (!type || typeof type !== 'string') {
      throw new TypeError(`"type" argument must be a string (received ${typeof type})`);
    }

    type = toHeaderCase(type);

    // Check if the ID is a string
    if (!id || typeof id !== 'string') {
      throw new TypeError(`"id" argument must be a string (received ${typeof id})`);
    }

    return true;
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = _isValidId;
