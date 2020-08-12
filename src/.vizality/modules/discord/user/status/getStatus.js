const { getModule } = require('@webpack');

const getValidId = require('../../utilities/getValidId');

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
   * Checks if user ID is a valid string
   * If user ID is an empty string, return the current user's ID
   */
  userId = getValidId(userId, 'user', _submodule);

  try {
    const StatusModule = getModule('getStatus', 'isMobileOnline');
    return StatusModule.getStatus(userId);
  } catch (err) {
    // Fail silently
  }
};

module.exports = getStatus;
