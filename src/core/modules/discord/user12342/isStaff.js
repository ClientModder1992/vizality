const { logger: { error } } = require('@vizality/util');

const getCurrentUserId = require('./getCurrentUserId');
const getUser = require('./getUser');

/**
 * Checks if the user is a Discord staff member.
 * If no user ID is provided, tries to use the current user.
 * @memberof discord.user
 * @param {snowflake} [userId] User ID
 * @returns {boolean} Whether the user is a Discord staff member
 */
const isStaff = (userId) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:isStaff';

  try {
    // If no user ID is provided, try to use the current user's ID
    if (arguments.length === 0) {
      userId = getCurrentUserId();
    }

    // Check if user ID is a string
    if (typeof userId !== 'string') {
      // Check if user ID is null, because typeof null is 'object' in Javascript...
      throw new TypeError(`"userId" argument must be a string (received ${userId === null ? 'null' : typeof userId})`);
    }

    const User = getUser(userId);

    return User.isStaff();
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = isStaff;
