const hasActivityOfType = require('./hasActivityOfType');
const getValidId = require('../../utility/getValidId');
const isValidId = require('../../utility/isValidId');

const Constants = require('../../modules/constants');

/**
 * Checks if the user has a custom status present.
 * If no user ID is specified, tries to check for the current user.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} Does the user have a custom status?
 */
const hasCustomStatus = (userId = '') => {
  const _submodule = 'Discord:User:Activity:hasCustomStatus';

  /*
   * If user ID is an empty string, return the current user's ID,
   * else return the userId argument value
   */
  userId = getValidId(userId, 'user', _submodule);

  // Check if the ID is a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  const { ActivityTypes } = Constants;

  try {
    const hasCustomStatus = hasActivityOfType(userId, ActivityTypes.CUSTOM_STATUS);
    return Boolean(hasCustomStatus);
  } catch (err) {
    // Fail silently
  }
};

module.exports = hasCustomStatus;
