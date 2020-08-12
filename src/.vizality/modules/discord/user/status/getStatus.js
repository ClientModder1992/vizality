const { getModule } = require('@webpack');

const getValidId = require('../../utilities/getValidId');
const isValidId = require('../../utilities/isValidId');

/**
 * Get's the user's status.
 * If no user ID is specified, tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {string} User status
 */
const getStatus = (userId = '') => {
  const _submodule = 'Discord:User:Status:getStatus';

  /*
   * If user ID is an empty string, return the current user's ID,
   * else return the userId argument value
   */
  userId = getValidId(userId, 'user', _submodule);

  // Check if the ID is a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  try {
    const StatusModule = getModule('getStatus', 'isMobileOnline');
    return StatusModule.getStatus(userId);
  } catch (err) {
    // Fail silently
  }
};

module.exports = getStatus;
