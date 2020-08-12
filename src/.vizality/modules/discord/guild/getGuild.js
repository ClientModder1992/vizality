const { logger: { error } } = require('@utilities');
const { getModule } = require('@webpack');

const getCurrentGuildId = require('./getCurrentGuildId');

const getGuild = (guildId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:Guild:getGuild';

  if (typeof guildId !== 'string') {
    return error(_module, _submodule, null, `Server ID must be a valid string.`);
  }

  if (!guildId) {
    guildId = getCurrentGuildId();

    if (!guildId) {
      return error(_module, _submodule, null, 'You did not specify a server ID and you do not currently have a server selected.');
    }
  }

  const Guild = getModule('getGuild').getGuild(guildId);

  if (!Guild) {
    return error(_module, _submodule, null, `Server with ID '${guildId}' not found. The ID is either invalid or the server is not yet cached.`);
  }

  return Guild;
};

module.exports = getGuild;
