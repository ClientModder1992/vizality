const getValidId = require('../../utilities/getValidId');
const getStatus = require('./getStatus');

/**
 * Checks if the user is idle.
 * If no user ID is specified, tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} Whether the user is idle or not
 */
const isIdle = (userId = '') => {
  const _submodule = 'Discord:User:Status:isIdle';

  /*
   * Checks if user ID is a valid string
   * If user ID is an empty string, return the current user's ID
   */
  userId = getValidId(userId, 'user', _submodule);

  try {
    const Status = getStatus(userId);
    return (Status && Status === 'idle');
  } catch (err) {
    // Fail silently
  }
};

module.exports = isIdle;
