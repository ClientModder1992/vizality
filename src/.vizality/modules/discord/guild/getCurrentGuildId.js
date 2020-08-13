const { getModule } = require('@webpack');

/**
 * Gets the currently selected server's ID.
 *
 * @returns {?string} Server ID
 */
const getCurrentGuildId = () => {
  try {
    const CurrentGuildModule = getModule('getLastSelectedGuildId');
    return CurrentGuildModule.getGuildId();
  } catch (err) {
    // Fail silently
  }
};

module.exports = getCurrentGuildId;
