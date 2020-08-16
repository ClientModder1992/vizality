const getLastSelectedGuildId = require('./getLastSelectedGuildId');
const getGuild = require('./getGuild');

/**
 * Gets the guild data object of the last selected guild.
 * @returns {?object} - Guild data object
 */
const getLastSelectedGuild = () => {
  try {
    return getGuild(getLastSelectedGuildId());
  } catch (err) {
    // Fail silently
  }
};

module.exports = getLastSelectedGuild;
