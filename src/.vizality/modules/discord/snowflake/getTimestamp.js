const getDeconstructedSnowflake = require('./getDeconstructedSnowflake');

// @docs

// vizality.modules.webpack.getModule('DISCORD_EPOCH').default.fromTimestamp(timestamp)
const getTimestamp = (snowflake) => {
  return getDeconstructedSnowflake(snowflake).timestamp;
};

module.exports = getTimestamp;
