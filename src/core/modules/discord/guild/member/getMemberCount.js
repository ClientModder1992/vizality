const { logger: { error } } = require('@vizality/util');
const { getModule } = require('@vizality/webpack');

const getCurrentGuildId = require('../getCurrentGuildId');

/**
 * Gets a guild's total member count.
 * If no guild ID is provided, tries to get the total member count of the current guild.
 * @memberof discord.guild.member
 * @param {snowflake} [guildId] Guild ID
 * @returns {number|undefined} Guild's total member count
 */
const getMemberCount = (guildId) => {
  const _module = 'Module';
  const _submodule = 'Discord:Guild:Member:getMemberCount';

  try {
    // If no guild ID is provided, use the current guild's ID
    guildId = guildId || getCurrentGuildId();

    const MemberCountModule = getModule('getMemberCounts');

    return MemberCountModule.getMemberCount(guildId);
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = getMemberCount;
