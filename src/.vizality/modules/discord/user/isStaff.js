const { logger: { error } } = require('@utilities');

const getUser = require('./getUser');

/**
 * Checks if the user is a Discord staff member.
 * If no user ID is specified, tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {(boolean|undefined)} Whether the user is a Discord staff member
 */
const isStaff = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:isStaff';

  // Check if the user ID is a valid string
  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  try {
    const isStaff = getUser(userId).isStaff();

    return isStaff;
  } catch (err) {
    // Fail silently
  }
};

module.exports = isStaff;
