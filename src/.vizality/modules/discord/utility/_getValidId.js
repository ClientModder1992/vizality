const { logger: { error } } = require('@utilities');

const getCurrentChannelId = require('../channel/getCurrentChannelId');
const getCurrentGuildId = require('../guild/getCurrentGuildId');
const getCurrentUserId = require('../user/getCurrentUserId');

/**
 * Gets a valid ID string.
 * @param {snowflake} id ID
 * @param {string} type ID descriptor
 * @param {?string} [submodule] Submodule
 * @returns {snowflake|string|undefined} ID of specified type
 * @private
 */
const _getValidId = (id, type, submodule) => {
  const _module = 'Module';
  let _submodule = submodule || 'Discord:Utility:_getValidId';

  try {
    // Check if the submodule is a string
    if (!_submodule || typeof _submodule !== 'string') {
      _submodule = 'Discord:Utility:_getValidId';
      throw new TypeError(`"submodule" argument must be a string (received ${typeof submodule})`);
    }

    // Check if the type is a string
    if (!type || typeof type !== 'string') {
      throw new TypeError(`"type" argument must be a string (received ${typeof type})`);
    }

    type = type.toLowerCase();

    switch (type) {
      case 'user':
        return getCurrentUserId();
      case 'guild':
        return getCurrentGuildId();
      case 'channel':
        return getCurrentChannelId();
    }

    return id;
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = _getValidId;
