const { logger: { error } } = require('@utilities');
const { getModule } = require('@webpack');

const getTag = require('./getTag');

/**
 * Gets a user's data object from their user tag.
 * If no user tag is specified, tries to get the data object of the current user.
 *
 * @param {string} [userTag] - User tag
 * @returns {(object|undefined)} User object or undefined
 */
const getUserByTag = (userTag = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:getUserByTag';

  // Check if the user ID is a valid string
  if (typeof userTag !== 'string') {
    return error(_module, _submodule, null, `User tag '${userTag}' is not a valid string.`);
  }

  // If no user tag specified, use the current user's tag
  if (!userTag) {
    userTag = getTag();

    /*
     * Check if there is a current user tag... not sure why/when there wouldn't be
     * but better safe than sorry
     */
    if (!userTag) {
      return error(_module, _submodule, null, 'You did not specify a user tag and no current user tag was found.');
    }
  }

  const username = userTag.slice(0, -5);
  const discriminator = userTag.slice(-4);

  try {
    const UserModule = getModule('getUser', 'getUsers');
    const User = UserModule.findByTag(username, discriminator);
    return User || error(_module, _submodule, null, `User with tag '${userTag}' not found. The tag is either invalid or the user is not yet cached.`);
  } catch (err) {
    // Fail silently
  }
};

module.exports = getUserByTag;
