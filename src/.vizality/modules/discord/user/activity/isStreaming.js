const { logger: { error } } = require('@utilities');

const hasActivityOfType = require('./hasActivityOfType');
const getCurrentUserId = require('../getCurrentUserId');

const Constants = require('../../modules/constants');

/**
 * Checks if the user is currently streaming. If no user ID is specified, tries
 * to check for the current user.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} Whether the user is streaming
 */
const isStreaming = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Activity:isStreaming';

  // Check if the user ID is a valid string
  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  // If no user ID specified, use the current user's ID
  if (!userId) {
    userId = getCurrentUserId();
  }

  const { ActivityTypes } = Constants;

  const isStreaming = hasActivityOfType(userId, ActivityTypes.STREAMING);

  return isStreaming;
};

module.exports = isStreaming;
