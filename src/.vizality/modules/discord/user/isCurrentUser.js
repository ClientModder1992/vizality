const { logger: { error } } = require('@utilities');

const getUser = require('./getUser');

/**
 * Checks if the user is the current user.
 * If no user ID is specified, it should always return true.
 *
 * @param {string} [userId] - User ID
 * @returns {(boolean|undefined)} Whether the user is the current user
 */
const isCurrentUser = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:isCurrentUser';

  // Check if the user ID is a valid string
  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  try {
    const isCurrentUser = getUser(userId).verified;

    return isCurrentUser;
  } catch (err) {
    // Fail silently
  }
};

module.exports = isCurrentUser;
