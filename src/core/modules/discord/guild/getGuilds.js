const { getModule } = require('@vizality/webpack');

/**
 * Gets all of the cached guild objects.
 * @returns {object<snowflake, Guild>} All of the cached guild objects
 * @note Returns an empty object if the user has not joined any guilds
 */
const getGuilds = () => {
  try {
    const GuildModule = getModule('getGuild', 'getGuilds');
    return GuildModule.getGuilds();
  } catch (err) {
    // Fail silently
  }
};

module.exports = getGuilds;
