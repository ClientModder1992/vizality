const { logger: { error } } = require('@utilities');

const getUser = require('./getUser');

/**
 * Gets a user's discriminator. If no user ID is specified, tries
 * to get the discriminator of the current user.
 *
 * @param {string} [userId] - User ID
 * @returns {string} User discriminator
 */
const getDiscriminator = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:getDiscriminator';

  // Check if the user ID is a valid string
  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  return getUser(userId).discriminator;
};

module.exports = getDiscriminator;
