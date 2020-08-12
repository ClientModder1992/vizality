const { getModule } = require('@webpack');

const getCurrentUserId = () => {
  const CurrentUserId = getModule('getId').getId();

  return CurrentUserId;
};

module.exports = getCurrentUserId;
