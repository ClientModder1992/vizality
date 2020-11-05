const { logger: { error } } = require('@vizality/util');

const hasActivityOfType = require('./hasActivityOfType');
const getCurrentUserId = require('../getCurrentUserId');

const Constants = require('../../module/constants');

/**
 * Checks if a user is watching something.
 * If no user ID is specified, tries to use the current user.
 * @memberof discord.user.activity
 * @param {snowflake} [userId] User ID
 * @returns {boolean} Whether the user is watching something
 */
const isWatching = (userId) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Activity:isWatching';

  // If no user ID is provided, try to use the current user's ID
  userId = userId || getCurrentUserId();

  const { ActivityTypes } = Constants;

  try {
    const isWatching = hasActivityOfType(userId, ActivityTypes.WATCHING);
    return Boolean(isWatching);
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = isWatching;
