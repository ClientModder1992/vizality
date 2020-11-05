const { logger: { error } } = require('@vizality/util');

const getCurrentUserId = require('../getCurrentUserId');
const _isStreaming = require('../activity/isStreaming');

/**
 * Checks if the user is streaming.
 * If no user ID is specified, tries to use the current user's ID.
 * @alias discord.user.activity.isStreaming
 * @param {snowflake} [userId] - User ID
 * @returns {boolean} Whether the user is streaming
 */
const isStreaming = (userId) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Status:isStreaming';

  // If no user ID is provided, use the current user's ID
  userId = userId || getCurrentUserId();

  try {
    return _isStreaming(userId);
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = isStreaming;
