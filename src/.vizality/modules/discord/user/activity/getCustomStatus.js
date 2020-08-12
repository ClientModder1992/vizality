const { logger: { error } } = require('@utilities');

const getActivitiesByType = require('./getActivitiesByType');
const hasCustomStatus = require('./hasCustomStatus');

const Constants = require('../../modules/constants');

/**
 * Gets a user's custom status. If no user ID is specified, tries
 * to get the custom status of the current user.
 *
 * @param {string} [userId] - User ID
 * @returns {object|void} User's custom status
 */
const getCustomStatus = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Activity:getCustomStatus';

  // Check if the user ID is a valid string
  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  // Check if the user has a custom status
  if (!hasCustomStatus(userId)) {
    return false;
  }

  const { ActivityTypes } = Constants;

  const CustomStatus = getActivitiesByType(userId, ActivityTypes.CUSTOM_STATUS);

  return CustomStatus;
};

module.exports = getCustomStatus;
