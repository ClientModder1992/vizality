const { logger: { error } } = require('@utilities');
const { getModule } = require('@webpack');

const getGuild = require('./getGuild');

/**
 * Checks if the server has an animated icon. If no server ID is specified,
 * tries to use the currently selected server's ID.
 *
 * @param {string} [guildId] - Server ID
 * @returns {boolean} Whether the server has an animated icon
 */
const hasAnimatedIcon = (guildId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:Guild:hasAnimatedIcon';

  // Check if the server ID is a valid string
  if (typeof guildId !== 'string') {
    return error(_module, _submodule, null, `Server ID must be a valid string.`);
  }

  const Guild = getGuild(guildId);
  const { hasAnimatedGuildIcon } = getModule('hasAnimatedGuildIcon');

  return hasAnimatedGuildIcon(Guild);
};

module.exports = hasAnimatedIcon;
