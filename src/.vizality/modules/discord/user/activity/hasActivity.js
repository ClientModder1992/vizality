const getPrimaryActivity = require('./getPrimaryActivity');
const getValidId = require('../../utilities/getValidId');
const isValidId = require('../../utilities/isValidId');

/**
 * Checks if the user has some activity present.
 * If no user ID is specified, tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} Does the user have an activity present?
 */
const hasActivity = (userId = '') => {
  const _submodule = 'Discord:User:Activity:hasActivity';

  /*
   * If user ID is an empty string, return the current user's ID,
   * else return the userId argument value
   */
  userId = getValidId(userId, 'user', _submodule);

  // Check if the ID is a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  // Check if the user has any activity
  try {
    const PrimaryActivity = getPrimaryActivity(userId);
    return Boolean(PrimaryActivity);
  } catch (err) {
    // Fail silently
  }
};

module.exports = hasActivity;
