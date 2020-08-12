const hasActivityOfType = require('./hasActivityOfType');
const getValidId = require('../../utilities/getValidId');
const isValidId = require('../../utilities/isValidId');

const Constants = require('../../modules/constants');

/**
 * Checks if the user is listening on Spotify.
 * If no user ID is specified, tries to check for the current user.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} Is the user listening on Spotify?
 */
const isListening = (userId = '') => {
  const _submodule = 'Discord:User:Activity:isListening';

  /*
   * If user ID is an empty string, return the current user's ID,
   * else return the userId argument value
   */
  userId = getValidId(userId, 'user', _submodule);

  // Check if the ID is a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  const { ActivityTypes } = Constants;

  try {
    const isListening = hasActivityOfType(userId, ActivityTypes.LISTENING);
    return Boolean(isListening);
  } catch (err) {
    // Fail silently
  }
};

module.exports = isListening;
