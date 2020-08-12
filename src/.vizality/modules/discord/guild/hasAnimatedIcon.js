const { logger: { error } } = require('@utilities');
const { getModule } = require('@webpack');

const getGuild = require('./getGuild');

const hasAnimatedIcon = (guildId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:Guild:hasAnimatedIcon';

  if (typeof guildId !== 'string') {
    return error(_module, _submodule, null, `Server ID must be a valid string.`);
  }

  const Guild = getGuild(guildId);
  const { hasAnimatedGuildIcon } = getModule('hasAnimatedGuildIcon');

  return hasAnimatedGuildIcon(Guild);
};

module.exports = hasAnimatedIcon;
