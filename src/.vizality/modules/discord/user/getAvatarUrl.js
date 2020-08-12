const { string: { isValidUrl } } = require('@utilities');

const getValidId = require('../utilities/getValidId');
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
   * Checks if user ID is a valid string
   * If user ID is an empty string, return the current user's ID
   */
  userId = getValidId(userId, 'user', _submodule);

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
