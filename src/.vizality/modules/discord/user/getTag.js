const getValidId = require('../utilities/getValidId');
const getUser = require('./getUser');

/**
 * Gets the user's tag.
 * If no user ID is specified, tries to get the avatar string of the current user.
 *
 * @param {string} [userId] - User ID
 * @returns {(string|undefined)} User tag or undefined
 */
const getTag = (userId = '') => {
  const _submodule = 'Discord:User:getTag';

  /*
   * Checks if user ID is a valid string
   * If user ID is an empty string, return the current user's ID
   */
  userId = getValidId(userId, 'user', _submodule);

  try {
    const { tag } = getUser(userId);

    return tag;
  } catch (err) {
    // Fail silently
  }
};

module.exports = getTag;
