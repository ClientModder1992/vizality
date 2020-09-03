const { logger: { error } } = require('@utilities');

const getCurrentUserId = require('./getCurrentUserId');
const getUser = require('./getUser');

/**
 * Checks if the user has a non-default avatar.
 * If no user ID is specified, tries to use the current user's ID.
 * @param {snowflake} [userId] - User ID
 * @returns {boolean} Whether the user has a non-default avatar
 */
const hasAvatar = (userId) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:hasAvatar';

  // If no user ID is provided, use the current user's ID
  userId = userId || getCurrentUserId();

  try {
    const User = getUser(userId);
    return User.avatar;
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = hasAvatar;
