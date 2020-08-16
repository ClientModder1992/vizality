const getDeconstructedSnowflake = require('./getDeconstructedSnowflake');

// @docs

const getDate = (snowflake) => {
  return getDeconstructedSnowflake(snowflake).date;
};

module.exports = getDate;
