const { getModule } = require('@webpack');

const getValidId = require('../../utilities/getValidId');
const isValidId = require('../../utilities/isValidId');

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
   * If user ID is an empty string, return the current user's ID,
   * else return the userId argument value
   */
  userId = getValidId(userId, 'user', _submodule);

  // Check if the ID is a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  try {
    const ActivitiesModule = getModule('getPrimaryActivity');
    return ActivitiesModule.getActivities(userId);
  } catch (err) {
    // Fail silently
  }
};

module.exports = getActivities;
