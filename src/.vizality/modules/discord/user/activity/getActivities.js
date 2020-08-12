const { getModule } = require('@webpack');

const getValidId = require('../../utilities/getValidId');

/**
 * Gets a user's current activities.
 * If no user ID is specified, tries to get the activities of the current user.
 *
 * @param {string} [userId] - User ID
 * @returns {(?Array|undefined)} User activities
 */
const getActivities = (userId = '') => {
  const _submodule = 'Discord:User:Activity:getActivities';

  /*
   * Checks if user ID is a valid string
   * If user ID is an empty string, return the current user's ID
   */
  userId = getValidId(userId, 'user', _submodule);

  try {
    const Activities = getModule('getPrimaryActivity').getActivities(userId);
    return Activities;
  } catch (err) {
    // Fail silently
  }
};

module.exports = getActivities;
