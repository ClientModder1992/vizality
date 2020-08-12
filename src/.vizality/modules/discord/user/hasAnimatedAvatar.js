const { logger: { error } } = require('@utilities');
const { getModule } = require('@webpack');

const getUser = require('./getUser');

/**
 * Checks if the user has an animated avatar.
 * If no user ID is specified, tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} Whether the user has an animated avatar
 */
const hasAnimatedAvatar = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:hasAnimatedAvatar';

  // Check if the user ID is a valid string
  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  try {
    const { hasAnimatedAvatar } = getModule('hasAnimatedAvatar');

    return hasAnimatedAvatar(getUser(userId));
  } catch (err) {
    // Fail silently
  }
};

module.exports = hasAnimatedAvatar;
