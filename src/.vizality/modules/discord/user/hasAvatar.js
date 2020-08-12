const getValidId = require('../utilities/getValidId');
const isValidId = require('../utilities/isValidId');
const getUser = require('./getUser');

/**
 * Checks if the user has a non-default avatar.
 * If no user ID is specified, tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} Does the user have a non-default avatar?
 */
const hasAvatar = (userId = '') => {
  const _submodule = 'Discord:User:hasAvatar';

  /*
   * If user ID is an empty string, return the current user's ID,
   * else return the userId argument value
   */
  userId = getValidId(userId, 'user', _submodule);

  // Check if the ID is a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  try {
    const { avatar } = getUser(userId);
    return Boolean(avatar);
  } catch (err) {
    // Fail silently
  }
};

module.exports = hasAvatar;
