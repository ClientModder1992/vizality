const { logger: { error } } = require('@vizality/util');

const getActivitiesByType = require('./getActivitiesByType');
const getCurrentUserId = require('../getCurrentUserId');
const hasCustomStatus = require('./hasCustomStatus');

const Constants = require('../../module/constants');

/**
 * Gets a user's custom status.
 * If no user ID is specified, tries to get the custom status of the current user.
 * @memberof discord.user.activity
 * @param {snowflake} [userId] User ID
 * @returns {Object|undefined} User's custom status
 */
const getCustomStatus = (userId) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Activity:getCustomStatus';

  try {
    // If no user ID is provided, use the current user's ID
    userId = userId || getCurrentUserId();

    // Check if the user has a custom status
    if (!hasCustomStatus(userId)) return false;

    const { ActivityTypes } = Constants;

    const CustomStatus = getActivitiesByType(userId, ActivityTypes.CUSTOM_STATUS);

    return CustomStatus;
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = getCustomStatus;
