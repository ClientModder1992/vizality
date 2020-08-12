const { getModule } = require('@webpack');

const getCurrentGuildId = () => {
  const CurrentGuildId = getModule('getLastSelectedGuildId').getGuildId();

  return CurrentGuildId;
};

module.exports = getCurrentGuildId;
