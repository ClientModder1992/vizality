const getValidId = require('../utilities/getValidId');
const isValidId = require('../utilities/isValidId');
const getUser = require('./getUser');

/**
 * Gets the user's discriminator.
 * If no user ID is specified, tries to get the avatar string of the current user.
 *
 * @param {string} [userId] - User ID
 * @returns {(string|undefined)} User discriminator or undefined
 */
const getDiscriminator = (userId = '') => {
  const _submodule = 'Discord:User:getDiscriminator';

  /*
   * If user ID is an empty string, return the current user's ID,
   * else return the userId argument value
   */
  userId = getValidId(userId, 'user', _submodule);

  // Check if the ID is now a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  try {
    const { discriminator } = getUser(userId);
    return discriminator;
  } catch (err) {
    // Fail silently
  }
};

module.exports = getDiscriminator;
