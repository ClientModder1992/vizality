const { logger: { error } } = require('@utilities');

const getCurrentUserId = require('../getCurrentUserId');
const getStatus = require('./getStatus');

/**
 * Checks if the user is offline.
 * If no user ID is specified, tries to use the current user's ID.
 * @param {snowflake} [userId] - User ID
 * @returns {boolean} Whether the user is online
 */
const isOnline = (userId) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Status:isOnline';

  // If no user ID is provided, use the current user's ID
  userId = userId || getCurrentUserId();

  try {
    const Status = getStatus(userId);
    return (Status && Status === 'online');
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = isOnline;
