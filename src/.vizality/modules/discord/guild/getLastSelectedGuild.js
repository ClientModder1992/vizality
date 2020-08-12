const getLastSelectedGuildId = require('./getLastSelectedGuildId');
const getGuild = require('./getGuild');

/**
 * Gets the server data object of the last selected server.
 *
 * @returns {?object} Server data object
 */
const getLastSelectedGuild = () => {
  if (!getLastSelectedGuildId()) {
    return null;
  }

  return getGuild(getLastSelectedGuildId());
};

module.exports = getLastSelectedGuild;
