const getValidId = require('../../utility/getValidId');
const isValidId = require('../../utility/isValidId');
const getStatus = require('./getStatus');

/**
 * Checks if the user is idle.
 * If no user ID is specified, tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} Is the user idle?
 */
const isIdle = (userId = '') => {
  const _submodule = 'Discord:User:Status:isIdle';

  /*
   * If user ID is an empty string, return the current user's ID,
   * else return the userId argument value
   */
  userId = getValidId(userId, 'user', _submodule);

  // Check if the ID is a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  try {
    const Status = getStatus(userId);
    return (Status && Status === 'idle');
  } catch (err) {
    // Fail silently
  }
};

module.exports = isIdle;
