const getValidId = require('../../utilities/getValidId');
const isValidId = require('../../utilities/isValidId');
const getActivities = require('./getActivities');

/**
 * Gets a user's primary activity object.
 * If no user ID is specified, tries to get the primary activity object of the current user.
 *
 * @param {string} [userId] - User ID
 * @returns {(object|undefined)} User primary activity object
 */
const getPrimaryActivity = (userId = '') => {
  const _submodule = 'Discord:User:Activity:getPrimaryActivity';

  /*
   * If user ID is an empty string, return the current user's ID,
   * else return the userId argument value
   */
  userId = getValidId(userId, 'user', _submodule);

  // Check if the ID is a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  try {
    const Activities = getActivities(userId);
    return Activities[0];
  } catch (err) {
    // Fail silently
  }
};

module.exports = getPrimaryActivity;
