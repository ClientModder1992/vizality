const { getModule } = require('@webpack');

const getLastSelectedGuildId = () => {
  return getModule('getLastSelectedGuildId').getLastSelectedGuildId();
};

module.exports = getLastSelectedGuildId;
