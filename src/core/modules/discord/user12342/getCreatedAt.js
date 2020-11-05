const { logger: { error } } = require('@vizality/util');

const getTimestamp = require('../snowflake/getTimestamp');
const getCurrentUserId = require('./getCurrentUserId');

/**
 * Gets a user's account creation date/time.
 * If no user ID is provided, tries to use the current user.
 * @memberof discord.user
 * @param {snowflake} [userId] User ID
 * @returns {string|undefined} User creation date timestamp in local string format
 */
const getCreatedAt = (userId) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:getCreatedAt';

  // If no user ID is provided, try to use the current user's ID
  userId = userId || getCurrentUserId();

  try {
    return getTimestamp(userId).toLocaleString();
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = getCreatedAt;
