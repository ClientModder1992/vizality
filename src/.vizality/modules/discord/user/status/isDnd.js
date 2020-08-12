const getValidId = require('../../utilities/getValidId');
const getStatus = require('./getStatus');

/**
 * Checks if the user is do not disturb.
 * If no user ID is specified, tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} Whether the user is do not disturb or not
 */
const isDnd = (userId = '') => {
  const _submodule = 'Discord:User:Status:isDnd';

  /*
   * Checks if user ID is a valid string
   * If user ID is an empty string, return the current user's ID
   */
  userId = getValidId(userId, 'user', _submodule);

  try {
    const Status = getStatus(userId);
    return (Status && Status === 'dnd');
  } catch (err) {
    // Fail silently
  }
};

module.exports = isDnd;
