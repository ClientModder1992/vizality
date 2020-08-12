const getValidId = require('../../utilities/getValidId');
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
   * Checks if user ID is a valid string
   * If user ID is an empty string, return the current user's ID
   */
  userId = getValidId(userId, 'user', _submodule);

  try {
    const Activity = getActivities(userId);
    return Activity[0];
  } catch (err) {
    // Fail silently
  }
};

module.exports = getPrimaryActivity;
