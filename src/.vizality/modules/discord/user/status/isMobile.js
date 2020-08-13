const { getModule } = require('@webpack');

const getValidId = require('../../utility/getValidId');
const isValidId = require('../../utility/isValidId');

/**
 * Checks if the user is on mobile.
 * If no user ID is specified, tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} Is the user on mobile?
 */
const isMobile = (userId = '') => {
  const _submodule = 'Discord:User:Status:isMobile';

  /*
   * If user ID is an empty string, return the current user's ID,
   * else return the userId argument value
   */
  userId = getValidId(userId, 'user', _submodule);

  // Check if the ID is a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  try {
    const StatusModule = getModule('getStatus', 'isMobileOnline');
    return StatusModule.isMobileOnline(userId);
  } catch (err) {
    // Fail silently
  }
};

module.exports = isMobile;
