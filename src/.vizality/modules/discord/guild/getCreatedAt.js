const { logger: { error } } = require('@utilities');

const getCreationDate = require('../utilities/getCreationDate');
const getCurrentGuildId = require('./getCurrentGuildId');

const getCreatedAt = (guildId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:Guild:getCreatedAt';

  if (typeof guildId !== 'string') {
    return error(_module, _submodule, null, `Guild ID must be a valid string.`);
  }

  if (!guildId) {
    guildId = getCurrentGuildId();

    if (!guildId) {
      return error(_module, _submodule, null, 'You did not specify a server ID and you do not currently have a server selected.');
    }
  }

  return getCreationDate(guildId);
};

module.exports = getCreatedAt;
