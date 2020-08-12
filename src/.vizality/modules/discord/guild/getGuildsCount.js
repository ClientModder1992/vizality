const getGuilds = require('./getGuilds');

/**
 * Gets a count of the user's currently active servers.
 *
 * @returns {number} Total joined server count
 */
const getGuildsCount = () => {
  return Object.keys(getGuilds()).length;
};

module.exports = getGuildsCount;
