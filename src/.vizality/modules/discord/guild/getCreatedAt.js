const { logger: { error } } = require('@utilities');

const getTimestamp = require('../snowflake/getTimestamp');
const getCurrentGuildId = require('./getCurrentGuildId');

/**
 * Gets a guild's creation date/time.
 * @memberof discord.guild
 * @param {snowflake} [guildId] Guild ID
 * @returns {?string} Guild creation date timestamp in local string format
 */
const getCreatedAt = (guildId) => {
  const _module = 'Module';
  const _submodule = 'Discord:Guild:getCreatedAt';

  // If no guild ID is provided, use the current guild ID
  guildId = guildId || getCurrentGuildId();

  try {
    return getTimestamp(guildId).toLocaleString();
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = getCreatedAt;
