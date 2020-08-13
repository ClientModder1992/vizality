const { logger: { error } } = require('@utilities');

const getCreationDate = require('../utility/getCreationDate');
const getCurrentGuildId = require('./getCurrentGuildId');

/**
 * Gets the server's creation date/time.
 *
 * @param {string} [guildId] - Server ID
 * @returns {?string} Server creation date timestamp in local string format
 */
const getCreatedAt = (guildId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:Guild:getCreatedAt';

  // Check if the guild ID is a valid string
  if (typeof guildId !== 'string') {
    return error(_module, _submodule, null, `Guild ID must be a valid string.`);
  }

  // If no server ID specified, use the currently selected server's ID
  if (!guildId) {
    guildId = getCurrentGuildId();

    // Check if there is a currently selected server
    if (!guildId) {
      return error(_module, _submodule, null, 'You did not specify a server ID and you do not currently have a server selected.');
    }
  }

  return getCreationDate(guildId);
};

module.exports = getCreatedAt;
