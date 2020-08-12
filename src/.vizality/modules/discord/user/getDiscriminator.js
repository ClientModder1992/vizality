const getValidId = require('../utilities/getValidId');
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
   * Checks if user ID is a valid string
   * If user ID is an empty string, return the current user's ID
   */
  userId = getValidId(userId, 'user', _submodule);

  try {
    const { discriminator } = getUser(userId);

    return discriminator;
  } catch (err) {
    // Fail silently
  }
};

module.exports = getDiscriminator;
