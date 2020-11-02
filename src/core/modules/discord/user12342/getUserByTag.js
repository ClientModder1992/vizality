const { logger: { error } } = require('@util');
const { getModule } = require('@webpack');

const getTag = require('./getTag');

/**
 * Gets a user object from their user tag.
 * If no user tag is specified, tries to get the current user object.
 * @param {snowflake} [userTag] User tag
 * @returns {User|undefined} User object
 */
const getUserByTag = (userTag) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:getUserByTag';

  // If no user tag is provided, use the current user's tag
  userTag = userTag || getTag();

  try {
    const username = userTag.slice(0, -5);
    const discriminator = userTag.slice(-4);

    const UserModule = getModule('getUser', 'getUsers');
    const User = UserModule.findByTag(username, discriminator);

    // Check if user tag is a string
    if (typeof userTag !== 'string') {
      throw new TypeError(`"userTag" argument must be a string (received ${typeof userTag})`);
    }

    // If no user object is returned
    if (!User) {
      throw `User with tag '${userTag}' not found. Either the tag is invalid or the user is not cached.`;
    }

    return User;
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = getUserByTag;
