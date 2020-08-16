const getDeconstructedSnowflake = require('./getDeconstructedSnowflake');

// @docs

const getBinary = (snowflake) => {
  return getDeconstructedSnowflake(snowflake).binary;
};

module.exports = getBinary;
