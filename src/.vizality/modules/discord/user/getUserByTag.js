const { logger: { error } } = require('@utilities');
const { getModule } = require('@webpack');

const getTag = require('./getTag');

/**
 * Gets a user's data object from their user tag. If no user tag is specified,
 * tries to get the data object of the current user.
 *
 * @param {string} [userTag] - User tag
 * @returns {object} User data object
 */
const getUserByTag = (userTag = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:getUserByTag';

  // Check if the user ID is a valid string
  if (typeof userTag !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  // If no user tag specified, use the current user's
  if (!userTag) {
    userTag = getTag();
  }

  const username = userTag.slice(0, -5);
  const discriminator = userTag.slice(-4);

  const User = getModule('getUser', 'getUsers').findByTag(username, discriminator);

  // Check if the user object exists
  if (!User) {
    return error(_module, _submodule, null, `User with tag '${userTag}' not found. The tag is either invalid or the user is not yet cached.`);
  }

  return User;
};

module.exports = getUserByTag;
