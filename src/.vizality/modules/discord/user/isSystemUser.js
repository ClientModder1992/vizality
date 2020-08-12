const { logger: { error } } = require('@utilities');

const getUser = require('./getUser');

/**
 * Checks if the user's account is a system account.
 * If no user ID is specified, tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {(boolean|undefined)} Whether the user is a system account
 */
const isSystemUser = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:isSystemUser';

  // Check if the user ID is a valid string
  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  try {
    const isSystemUser = getUser(userId).isSystemUser();

    return isSystemUser;
  } catch (err) {
    // Fail silently
  }
};

module.exports = isSystemUser;
