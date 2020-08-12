const hasActivityOfType = require('./hasActivityOfType');
const getValidId = require('../../utilities/getValidId');

const Constants = require('../../modules/constants');

/**
 * Checks if the user has a custom status present.
 * If no user ID is specified, tries to check for the current user.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} Whether the user has a custom status
 */
const hasCustomStatus = (userId = '') => {
  const _submodule = 'Discord:User:Activity:hasCustomStatus';

  /*
   * Checks if user ID is a valid string
   * If user ID is an empty string, return the current user's ID
   */
  userId = getValidId(userId, 'user', _submodule);

  const { ActivityTypes } = Constants;

  try {
    const hasCustomStatus = hasActivityOfType(userId, ActivityTypes.CUSTOM_STATUS);
    return Boolean(hasCustomStatus);
  } catch (err) {
    // Fail silently
  }
};

module.exports = hasCustomStatus;
