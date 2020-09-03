const { logger: { error } } = require('@utilities');

const getCurrentUserId = require('./getCurrentUserId');
const getUser = require('./getUser');

/**
 * Gets the user's tag.
 * If no user ID is specified, tries to get the avatar string of the current user.
 * @param {snowflake} [userId] - User ID
 * @returns {string|undefined} User tag
 */
const getTag = (userId) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:getTag';

  // If no user ID is provided, use the current user's ID
  userId = userId || getCurrentUserId();

  try {
    const User = getUser(userId);
    return User.tag;
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = getTag;
