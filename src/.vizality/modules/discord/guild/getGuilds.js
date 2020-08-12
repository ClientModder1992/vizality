const { getModule } = require('@webpack');

/**
 * Gets all of the user's active server data objects.
 *
 * @returns {object} All of the server data objects of the user's current servers
 */
const getGuilds = () => {
  return getModule('getGuild').getGuilds();
};

module.exports = getGuilds;
