const { logger: { error } } = require('@util');

const getCurrentUserId = require('./getCurrentUserId');
const getUser = require('./getUser');

/**
 * Gets the user's avatar string.
 * If no user ID is specified, tries to get the avatar string of the current user.
 * @param {snowflake} [userId] - User ID
 * @returns {string|undefined} User avatar string
 */
const getAvatarString = (userId) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:getAvatarString';

  // If no user ID is provided, use the current user's ID
  userId = userId || getCurrentUserId();

  try {
    const User = getUser(userId);
    return User.avatar;
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = getAvatarString;
