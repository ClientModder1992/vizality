const { getModule } = require('@webpack');

/**
 * Gets the current user's ID.
 *
 * @returns {(string|undefined)} User ID or undefined
 */
const getCurrentUserId = () => {
  try {
    const CurrentUserId = getModule('getId').getId();

    return CurrentUserId;
  } catch (err) {
    // Fail silently
  }
};

module.exports = getCurrentUserId;
