const { logger: { error } } = require('@vizality/util');

const getCurrentUserId = require('./getCurrentUserId');
const getUser = require('./getUser');

/**
 * Gets the user's discriminator.
 * If no user ID is specified, tries to get the avatar string of the current user.
 * @param {snowflake} [userId] - User ID
 * @returns {string|undefined} User discriminator
 */
const getDiscriminator = (userId) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:getDiscriminator';

  // If no user ID is provided, use the current user's ID
  userId = userId || getCurrentUserId();

  try {
    const User = getUser(userId);
    return User.discriminator;
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = getDiscriminator;
