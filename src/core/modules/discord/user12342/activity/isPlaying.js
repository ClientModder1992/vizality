const { logger: { error } } = require('@util');

const hasActivityOfType = require('./hasActivityOfType');
const getCurrentUserId = require('../getCurrentUserId');

const Constants = require('../../module/constants');

/**
 * Checks if a user is currently playing a game.
 * If no user ID is specified, tries to use the current user.
 * @memberof discord.user.activity
 * @param {string} [userId] User ID
 * @returns {boolean} Whether the user is playing a game
 */
const isPlaying = (userId) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Activity:isPlaying';

  // If no user ID is provided, try to use the current user's ID
  userId = userId || getCurrentUserId();

  const { ActivityTypes } = Constants;

  try {
    const isPlaying = hasActivityOfType(userId, ActivityTypes.PLAYING);
    return Boolean(isPlaying);
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = isPlaying;
