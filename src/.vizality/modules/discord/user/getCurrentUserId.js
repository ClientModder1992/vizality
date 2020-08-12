const { getModule } = require('@webpack');

/**
 * Gets the current user's ID.
 *
 * @returns {?string} User ID
 */
const getCurrentUserId = () => {
  const CurrentUserId = getModule('getId').getId();

  return CurrentUserId;
};

module.exports = getCurrentUserId;
