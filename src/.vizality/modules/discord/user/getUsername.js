const { logger: { error } } = require('@utilities');

const getUser = require('./getUser');

/**
 * Gets the user's username.
 * If no user ID is specified, tries to get the avatar string of the current user.
 *
 * @param {string} [userId] - User ID
 * @returns {(string|undefined)} User username or undefined
 */
const getUsername = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:getUsername';

  // Check if the user ID is a valid string
  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  try {
    const { username } = getUser(userId);

    return username;
  } catch (err) {
    // Fail silently
  }
};

module.exports = getUsername;
