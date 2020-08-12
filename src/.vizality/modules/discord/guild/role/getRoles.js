const { logger: { error } } = require('@utilities');

const getCurrentGuildId = require('../getCurrentGuildId');
const getGuild = require('../getGuild');

const getRoles = (guildId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:Guild:Role:getRoles';

  if (typeof guildId !== 'string') {
    return error(_module, _submodule, null, 'Guild ID must be a valid string.');
  }

  if (!guildId) {
    guildId = getCurrentGuildId();

    if (!guildId) {
      return error(_module, _submodule, null, 'You did not specify a server ID and you do not currently have a server selected.');
    }
  }

  const Roles = getGuild(guildId).roles;

  return Roles;
};

module.exports = getRoles;
