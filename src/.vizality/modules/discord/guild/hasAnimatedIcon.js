const { logger: { error } } = require('@util');
const { getModule } = require('@webpack');

const getGuild = require('./getGuild');

/**
 * Checks if the guild has an animated icon.
 * If no guild ID is specified, tries to use the currently selected guild's ID.
 * @param {string} [guildId] - Server ID
 * @returns {boolean} - Whether or not the server has an animated icon
 */
const hasAnimatedIcon = (guildId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:Guild:hasAnimatedIcon';

  // Check if guild ID is a string
  if (typeof guildId !== 'string') {
    throw new TypeError(`"guildId" argument must be a string (received ${typeof guildId})`);
  }

  try {
    const Guild = getGuild(guildId);
    const ImageResolver = getModule('getUserAvatarURL', 'getGuildIconURL', 'hasAnimatedGuildIcon');
    return ImageResolver.hasAnimatedGuildIcon(Guild);
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = hasAnimatedIcon;
