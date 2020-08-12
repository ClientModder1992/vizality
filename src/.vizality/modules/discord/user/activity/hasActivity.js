const getPrimaryActivity = require('./getPrimaryActivity');
const getValidId = require('../../utilities/getValidId');

/**
 * Checks if the user has some activity present.
 * If no user ID is specified, tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} Whether the user has an activity present
 */
const hasActivity = (userId = '') => {
  const _submodule = 'Discord:User:Activity:hasActivity';

  /*
   * Checks if user ID is a valid string
   * If user ID is an empty string, return the current user's ID
   */
  userId = getValidId(userId, 'user', _submodule);

  // Check if the user has any activity
  try {
    const PrimaryActivity = getPrimaryActivity(userId);
    return Boolean(PrimaryActivity);
  } catch (err) {
    // Fail silently
  }
};

module.exports = hasActivity;
