const { string: { isValidUrl } } = require('@utilities');

const getValidId = require('../utility/getValidId');
const isValidId = require('../utility/isValidId');
const getUser = require('./getUser');

/**
 * Gets the user's avatar URL.
 * If no user ID is specified, tries to get the avatar URL of the current user.
 *
 * @param {string} [userId] - User ID
 * @returns {(string|undefined)} User avatar URL or undefined
 */
const getAvatarUrl = (userId = '') => {
  const _submodule = 'Discord:User:getAvatarUrl';

  /*
   * If user ID is an empty string, return the current user's ID,
   * else return the userId argument value
   */
  userId = getValidId(userId, 'user', _submodule);

  // Check if the ID is a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  try {
    const { avatarURL } = getUser(userId);

    // Check if the avatar URL exists, is not a valid URL, and starts with /
    if (avatarURL && !isValidUrl(avatarURL) && avatarURL.startsWith('/')) {
      return window.location.origin + avatarURL;
    }

    return avatarURL;
  } catch (err) {
    // Fail silently
  }
};

module.exports = getAvatarUrl;
