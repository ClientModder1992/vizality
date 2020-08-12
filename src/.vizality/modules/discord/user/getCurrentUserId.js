const { getModule } = require('@webpack');

/**
 * Gets the current user's ID.
 *
 * @returns {(string|undefined)} User ID or undefined
 */
const getCurrentUserId = () => {
  try {
    const CurrentUserIdModule = getModule('getId');
    return CurrentUserIdModule.getId();
  } catch (err) {
    // Fail silently
  }
};

module.exports = getCurrentUserId;
