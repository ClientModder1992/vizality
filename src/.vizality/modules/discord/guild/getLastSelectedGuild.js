const getLastSelectedGuildId = require('./getLastSelectedGuildId');
const getGuild = require('./getGuild');

const getLastSelectedGuild = () => {
  if (!getLastSelectedGuildId()) {
    return null;
  }

  return getGuild(getLastSelectedGuildId());
};

module.exports = getLastSelectedGuild;
