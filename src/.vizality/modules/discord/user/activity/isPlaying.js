const hasActivityOfType = require('./hasActivityOfType');
const getValidId = require('../../utilities/getValidId');
const isValidId = require('../../utilities/isValidId');

const Constants = require('../../modules/constants');

/**
 * Checks if the user is currently playing a game.
 * If no user ID is specified, tries to check for the current user.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} Is the user playing a game?
 */
const isPlaying = (userId = '') => {
  const _submodule = 'Discord:User:Activity:isPlaying';

  /*
   * If user ID is an empty string, return the current user's ID,
   * else return the userId argument value
   */
  userId = getValidId(userId, 'user', _submodule);

  // Check if the ID is a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  const { ActivityTypes } = Constants;

  try {
    const isPlaying = hasActivityOfType(userId, ActivityTypes.PLAYING);
    return Boolean(isPlaying);
  } catch (err) {
    // Fail silently
  }
};

module.exports = isPlaying;
