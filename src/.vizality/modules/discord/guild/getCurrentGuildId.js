const { getModule } = require('@webpack');

/**
 * Gets the currently selected server's ID.
 *
 * @returns {?string} Server ID
 */
const getCurrentGuildId = () => {
  const CurrentGuildId = getModule('getLastSelectedGuildId').getGuildId();

  return CurrentGuildId;
};

module.exports = getCurrentGuildId;
