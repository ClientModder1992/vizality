const { logger: { error } } = require('@util');

const hasActivityOfType = require('./hasActivityOfType');
const getCurrentUserId = require('../getCurrentUserId');

const Constants = require('../../module/constants');

/**
 * Checks if a user is currently streaming.
 * If no user ID is specified, tries to use the current user.
 * @memberof discord.user.activity
 * @param {snowflake} [userId] User ID
 * @returns {boolean} Whether the user is streaming
 */
const isStreaming = (userId) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Activity:isStreaming';

  // If no user ID is provided, try to use the current user's ID
  userId = userId || getCurrentUserId();

  const { ActivityTypes } = Constants;

  try {
    const isStreaming = hasActivityOfType(userId, ActivityTypes.STREAMING);
    return Boolean(isStreaming);
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = isStreaming;
