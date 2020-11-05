const { logger: { error } } = require('@vizality/util');

const hasActivityOfType = require('./hasActivityOfType');
const getCurrentUserId = require('../getCurrentUserId');

const Constants = require('../../module/constants');

/**
 * Checks if a user is listening on Spotify.
 * If no user ID is specified, tries to check for the current user.
 * @memberof discord.user.activity
 * @param {snowflake} [userId] User ID
 * @returns {boolean} Whether the user is listening on Spotify
 */
const isListening = (userId) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Activity:isListening';

  // If no user ID is provided, try to use the current user's ID
  userId = userId || getCurrentUserId();

  const { ActivityTypes } = Constants;

  try {
    const isListening = hasActivityOfType(userId, ActivityTypes.LISTENING);
    return Boolean(isListening);
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = isListening;
