const getValidId = require('../utilities/getValidId');
const isValidId = require('../utilities/isValidId');
const getUser = require('./getUser');

const Constants = require('../modules/constants');

/**
 * Checks if the user is a Discord partner.
 * If no user ID is specified, tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} Whether the user is a Discord partner
 */
const isPartner = (userId = '') => {
  const _submodule = 'Discord:User:isPartner';

  /*
   * If user ID is an empty string, return the current user's ID,
   * else return the userId argument value
   */
  userId = getValidId(userId, 'user', _submodule);

  // Check if the ID is now a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  try {
    const isPartner = getUser(userId).hasFlag(Constants.UserFlags.PARTNER);
    return Boolean(isPartner);
  } catch (err) {
    // Fail silently
  }
};

module.exports = isPartner;
