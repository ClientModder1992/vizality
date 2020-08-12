const getValidId = require('../../utilities/getValidId');
const getStatus = require('./getStatus');

/**
 * Checks if the user is offline.
 * If no user ID is specified, tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} Whether the user is offline or not
 */
const isOffline = (userId = '') => {
  const _submodule = 'Discord:User:Status:isOffline';

  /*
   * Checks if user ID is a valid string
   * If user ID is an empty string, return the current user's ID
   */
  userId = getValidId(userId, 'user', _submodule);

  try {
    const Status = getStatus(userId);
    return (Status && Status === 'offline');
  } catch (err) {
    // Fail silently
  }
};

module.exports = isOffline;
