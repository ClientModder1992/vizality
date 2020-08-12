const { logger: { error } } = require('@utilities');

const hasActivityOfType = require('./hasActivityOfType');
const getCurrentUserId = require('../getCurrentUserId');

const Constants = require('../../modules/constants');

/**
 * Checks if the user is currently watching something. If no user ID is specified, tries
 * to check for the current user.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} Whether the user has a watching activity
 */
const isWatching = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Activity:isWatching';

  // Check if the user ID is a valid string
  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  // If no user ID specified, use the current user's
  if (!userId) {
    userId = getCurrentUserId();
  }

  const { ActivityTypes } = Constants;

  const isWatching = hasActivityOfType(userId, ActivityTypes.WATCHING);

  return isWatching;
};

module.exports = isWatching;
