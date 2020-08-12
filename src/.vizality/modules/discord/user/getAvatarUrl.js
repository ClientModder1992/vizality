const { string: { isValidUrl }, logger: { error } } = require('@utilities');

const getUser = require('./getUser');

/**
 * Gets a user's avatar URL. If no user ID is specified, tries
 * to get the avatar URL of the current user.
 *
 * @param {string} [userId] - User ID
 * @returns {string} User avatar URL
 */
const getAvatarUrl = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:getAvatarUrl';

  // Check if the user ID is a valid string
  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  const avatarURL = getUser(userId).avatarURL || null;

  // Check if the avatar URL exists, is not a valid URL, and starts with /
  if (avatarURL && !isValidUrl(avatarURL) && avatarURL.startsWith('/')) {
    return window.location.origin + avatarURL;
  }

  return avatarURL;
};

module.exports = getAvatarUrl;
