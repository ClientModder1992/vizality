const { logger: { error } } = require('@utilities');

/*
 * @todo Long is only used here and getSnowflake. It may be worth adding that particular section
 * from Long, rather than including the entire module, as it is over 170 kb.
 */
const Long = require('long');

/**
 * Generates a Discord snowflake.
 * <info>This hardcodes the worker ID as 1 and the process ID as 0.</info>
 * Alternatively, you can also perform this action directly using internals (less performant):
 * vizality.modules.webpack.getModule('DISCORD_EPOCH').default.fromTimestamp(new Date())
 * Sourced from @see {@link https://discord.js.org|discord.js}
 * @param {number|Date} [timestamp=Date.now()] Timestamp or date of the snowflake to generate
 * @returns {snowflake} The generated snowflake
 */
const getSnowflake = (timestamp = Date.now()) => {
  const _module = 'Module';
  const _submodule = 'Discord:Snowflake:Action:getSnowflake';

  // Discord epoch (2015-01-01T00:00:00.000Z)
  const EPOCH = 1420070400000;
  let INCREMENT = 0;

  try {
    const _pad = (v, n, c = '0') => {
      return String(v).length >= n ? String(v) : (String(c).repeat(n) + v).slice(-n);
    };

    // Check if timestamp is a date
    if (timestamp instanceof Date) {
      timestamp = timestamp.getTime();
    }

    // Check if timestamp is now a number
    if (typeof timestamp !== 'number' || isNaN(timestamp)) {
      throw new TypeError(`"timestamp" argument must be a number (received ${isNaN(timestamp) ? 'NaN' : typeof timestamp})`);
    }

    if (INCREMENT >= 4095) {
      INCREMENT = 0;
    }

    const BINARY = `${_pad((timestamp - EPOCH).toString(2), 42)}0000100000${_pad((INCREMENT++).toString(2), 12)}`;

    return Long.fromString(BINARY, 2).toString();
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = getSnowflake;
