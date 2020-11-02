const getGuilds = require('./getGuilds');

/**
 * Gets a count of the user's currently active guilds.
 * @returns {number} - Total joined guild count
 */
const getGuildsCount = () => {
  try {
    return Object.keys(getGuilds()).length;
  } catch (err) {
    // Fail silently
  }
};

module.exports = getGuildsCount;
