const { getModule } = require('@webpack');

const getChannelCategories = (guildId = '') => {
  return getModule('getChannels', 'getDefaultChannel').getChannels(guildId).SELECTABLE;
};

module.exports = getChannelCategories;
