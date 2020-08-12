const { getModule } = require('@webpack');

const getValidId = require('../../utilities/getValidId');

/**
 * Checks if the user is on mobile.
 * If no user ID is specified, tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} Whether the user is on mobile or not
 */
const isMobile = (userId = '') => {
  const _submodule = 'Discord:User:Status:isMobile';

  /*
   * Checks if user ID is a valid string
   * If user ID is an empty string, return the current user's ID
   */
  userId = getValidId(userId, 'user', _submodule);

  try {
    const StatusModule = getModule('getStatus', 'isMobileOnline');
    return StatusModule.isMobileOnline(userId);
  } catch (err) {
    // Fail silently
  }
};

module.exports = isMobile;
