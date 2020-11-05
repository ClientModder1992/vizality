const { logger: { error } } = require('@vizality/util');

const getCurrentUserId = require('./getCurrentUserId');
const getUser = require('./getUser');

const Constants = require('../module/constants');

/**
 * Checks if the user is a bug hunter.
 * If no user ID is specified, tries to use the current user's ID.
 * @param {snowflake} [userId] - User ID
 * @returns {boolean|undefined} Whether the user is a bug hunter
 */
const isBugHunter = (userId) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:isBugHunter';

  // If no user ID is provided, use the current user's ID
  userId = userId || getCurrentUserId();

  try {
    const User = getUser(userId);
    return User.hasFlag(Constants.UserFlags.BUG_HUNTER_LEVEL_1) || User.hasFlag(Constants.UserFlags.BUG_HUNTER_LEVEL_2);
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = isBugHunter;
