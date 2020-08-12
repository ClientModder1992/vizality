const { getModule } = require('@webpack');

/**
 * Gets the server ID of the last selected server.
 *
 * @returns {?string} Server ID
 */
const getLastSelectedGuildId = () => {
  return getModule('getLastSelectedGuildId').getLastSelectedGuildId();
};

module.exports = getLastSelectedGuildId;
