const { logger: { error } } = require('@utilities');

const hasActivityOfType = require('./hasActivityOfType');
const getCurrentUserId = require('../getCurrentUserId');

const Constants = require('../../module/constants');

/**
 * Checks if a user has a custom status.
 * If no user ID is provided, tries to use the current user.
 * @memberof discord.user.activity
 * @param {snowflake} [userId] User ID
 * @returns {boolean} Whether the user has a custom status
 */
const hasCustomStatus = (userId) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Activity:hasCustomStatus';

  // If no user ID is provided, try to use the current user's ID
  userId = userId || getCurrentUserId();

  const { ActivityTypes } = Constants;

  try {
    const hasCustomStatus = hasActivityOfType(userId, ActivityTypes.CUSTOM_STATUS);
    return Boolean(hasCustomStatus);
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = hasCustomStatus;
