const { logger: { error } } = require('@utilities');

const getCurrentChannelId = require('../channel/getCurrentChannelId');
const getCurrentGuildId = require('../guild/getCurrentGuildId');
const getCurrentUserId = require('../user/getCurrentUserId');

/**
 * Gets a valid ID string.
 *
 * @param {string} id - ID
 * @param {string} type - ID descriptor
 * @param {?string} submodule - Submodule
 * @returns {(string|undefined)} ID
 */
const getValidId = (id, type, submodule = null) => {
  const _module = 'Module';
  const _submodule = submodule || 'Discord:Utilities:getValidId';

  // Check for ID
  if (!id) {
    // Check if the type is a valid string
    if (!type || typeof type !== 'string') {
      return error(_module, _submodule, null, `Type '${type}' is not a valid string.`);
    }

    type = type.toLowerCase();

    switch (type) {
      case 'user':
        return getCurrentUserId();
      case 'guild':
        return getCurrentGuildId();
      case 'channel':
        return getCurrentChannelId();
      default:
        return error(_module, _submodule, null, `Could not find a valid ${type} ID for the current ${type}.`);
    }
  } else {
    return id;
  }
};

module.exports = getValidId;
