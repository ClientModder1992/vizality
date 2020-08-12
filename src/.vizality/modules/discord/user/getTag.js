const getValidId = require('../utilities/getValidId');
const isValidId = require('../utilities/isValidId');
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
   * If user ID is an empty string, return the current user's ID,
   * else return the userId argument value
   */
  userId = getValidId(userId, 'user', _submodule);

  // Check if the ID is a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  try {
    const { tag } = getUser(userId);
    return tag;
  } catch (err) {
    // Fail silently
  }
};

module.exports = getTag;
