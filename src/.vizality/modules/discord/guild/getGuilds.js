const { getModule } = require('@webpack');

const getGuilds = () => {
  return getModule('getGuild').getGuilds();
};

module.exports = getGuilds;
