const getActivitiesByType = require('./getActivitiesByType');
const getValidId = require('../../utilities/getValidId');
const isValidId = require('../../utilities/isValidId');
const hasCustomStatus = require('./hasCustomStatus');

const Constants = require('../../modules/constants');

/**
 * Gets a user's custom status.
 * If no user ID is specified, tries to get the custom status of the current user.
 *
 * @param {string} [userId] - User ID
 * @returns {(object|undefined)} User's custom status
 */
const getCustomStatus = (userId = '') => {
  const _submodule = 'Discord:User:Activity:getCustomStatus';

  /*
   * If user ID is an empty string, return the current user's ID,
   * else return the userId argument value
   */
  userId = getValidId(userId, 'user', _submodule);

  // Check if the ID is a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  // Check if the user has a custom status
  if (!hasCustomStatus(userId)) {
    return false;
  }

  const { ActivityTypes } = Constants;

  try {
    const CustomStatus = getActivitiesByType(userId, ActivityTypes.CUSTOM_STATUS);
    return CustomStatus;
  } catch (err) {
    // Fail silently
  }
};

module.exports = getCustomStatus;
