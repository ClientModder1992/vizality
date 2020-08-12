const { logger: { error } } = require('@utilities');

const getUser = require('./getUser');

/**
 * Gets the user's avatar string.
 * If no user ID is specified, tries to get the avatar string of the current user.
 *
 * @param {string} [userId] - User ID
 * @returns {(string|undefined)} User avatar string or undefined
 */
const getAvatarString = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:getAvatarString';

  // Check if the user ID is a valid string
  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  try {
    const { avatar } = getUser(userId);

    return avatar;
  } catch (err) {
    // Fail silently
  }
};

module.exports = getAvatarString;
