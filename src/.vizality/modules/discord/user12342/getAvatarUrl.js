const { string: { isUrl }, logger: { error } } = require('@utilities');

const getCurrentUserId = require('./getCurrentUserId');
const getUser = require('./getUser');

/**
 * Gets the user's avatar URL.
 * If no user ID is specified, tries to get the avatar URL of the current user.
 * @param {snowflake} [userId] User ID
 * @returns {string|undefined} User avatar URL
 */
const getAvatarUrl = (userId) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:getAvatarUrl';

  // If no user ID is provided, use the current user's ID
  userId = userId || getCurrentUserId();

  try {
    const User = getUser(userId);
    const { avatarURL } = User;

    // Check if the avatar URL exists, is not a valid URL, and starts with /
    if (avatarURL && !isUrl(avatarURL) && avatarURL.startsWith('/')) {
      return window.location.origin + avatarURL;
    }

    return avatarURL;
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = getAvatarUrl;
