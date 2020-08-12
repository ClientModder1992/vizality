const { logger: { error } } = require('@utilities');

const getUser = require('./getUser');

const Constants = require('../modules/constants');

/**
 * Checks if the user is a Discord partner.
 * If no user ID is specified, tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {(boolean|undefined)} Whether the user is a Discord partner
 */
const isPartner = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:isPartner';

  // Check if the user ID is a valid string
  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  try {
    const isPartner = getUser(userId).hasFlag(Constants.UserFlags.PARTNER);

    return isPartner;
  } catch (err) {
    // Fail silently
  }
};

module.exports = isPartner;
