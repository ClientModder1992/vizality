const { logger: { error } } = require('@vizality/util');
const { getModule } = require('@vizality/webpack');

const getCurrentUserId = require('./getCurrentUserId');
const getUser = require('./getUser');

/**
 * Checks if the user has an animated avatar.
 * If no user ID is specified, tries to use the current user's ID.
 * @param {snowflake} [userId] - User ID
 * @returns {boolean} Whether the user has an animated avatar
 */
const hasAnimatedAvatar = (userId) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:hasAnimatedAvatar';

  // If no user ID is provided, use the current user's ID
  userId = userId || getCurrentUserId();

  try {
    const User = getUser(userId);
    const ImageResolver = getModule('getUserAvatarURL', 'getGuildIconURL', 'hasAnimatedGuildIcon');
    return ImageResolver.hasAnimatedAvatar(User);
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = hasAnimatedAvatar;
