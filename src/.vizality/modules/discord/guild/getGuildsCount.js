const getGuilds = require('./getGuilds');

const getGuildsCount = () => {
  return Object.keys(getGuilds()).length;
};

module.exports = getGuildsCount;
