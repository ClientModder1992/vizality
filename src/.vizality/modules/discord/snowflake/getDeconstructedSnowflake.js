/* eslint-disable spaced-comment */
const { logger: { error } } = require('@utilities');

/*
 * @todo Long is only used here and getSnowflake. It may be worth adding that particular section
 * from Long, rather than including the entire module, as it is over 170 kb.
 */
const Long = require('long');

/**
 * Deconstructs a snowflake.
 * Sourced from @see {@link https://discord.js.org|discord.js}
 * @param {snowflake} snowflake Snowflake to deconstruct
 * @returns {DeconstructedSnowflake} Deconstructed snowflake
 */
const getDeconstructedSnowflake = (snowflake) => {
  const _module = 'Module';
  const _submodule = 'Discord:Snowflake:getDeconstructedSnowflake';

  // Discord epoch (2015-01-01T00:00:00.000Z)
  const EPOCH = 1420070400000;

  try {
    const _pad = (v, n, c = '0') => {
      return String(v).length >= n ? String(v) : (String(c).repeat(n) + v).slice(-n);
    };

    const BINARY = _pad(Long.fromString(snowflake).toString(2), 64);

    const res = {
      timestamp: parseInt(BINARY.substring(0, 42), 2) + EPOCH,
      workerID: parseInt(BINARY.substring(42, 47), 2),
      processID: parseInt(BINARY.substring(47, 52), 2),
      increment: parseInt(BINARY.substring(52, 64), 2),
      binary: BINARY
    };

    Object.defineProperty(res, 'date', {
      get: function get () {
        return new Date(this.timestamp);
      },
      enumerable: true
    });

    return res;
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = getDeconstructedSnowflake;
