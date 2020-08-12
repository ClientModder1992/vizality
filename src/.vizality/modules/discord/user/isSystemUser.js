const getValidId = require('../utilities/getValidId');
const isValidId = require('../utilities/isValidId');
const getUser = require('./getUser');

/**
 * Checks if the user's account is a system account.
 * If no user ID is specified, tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} Whether the user is a system account
 */
const isSystemUser = (userId = '') => {
  const _submodule = 'Discord:User:isSystemUser';

  /*
   * If user ID is an empty string, return the current user's ID,
   * else return the userId argument value
   */
  userId = getValidId(userId, 'user', _submodule);

  // Check if the ID is now a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  try {
    const isSystemUser = getUser(userId).isSystemUser();
    return Boolean(isSystemUser);
  } catch (err) {
    // Fail silently
  }
};

module.exports = isSystemUser;
