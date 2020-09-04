/* eslint-disable jsdoc/require-returns *//* eslint-disable jsdoc/require-param */
const { logger: { error } } = require('@util');

/*
 * @todo Long is only used here. It may be worth adding that particular section
 * from Long, rather than including the entire module, as it is over 170 kb. 💀
 */
const Long = require('long');

// Discord epoch (2015-01-01T00:00:00.000Z)
const EPOCH = 1420070400000;

const _module = 'Module';
const _submodule = 'Discord:Snowflake';

/**
 * Snowflake module.
 * Contains functions/data relating to snowflakes.
 * Discord utilizes Twitter's snowflake format for uniquely identifiable descriptors (IDs).
 * These IDs are guaranteed to be unique across all of Discord, except in some unique
 * scenarios in which child objects share their parent's ID. Because Snowflake IDs are up
 * to 64 bits in size (e.g. a uint64), they are always returned as strings in the HTTP API
 * to prevent integer overflows in some languages. See Gateway ETF/JSON for more information
 * regarding Gateway encoding.
 * @see {@link https://discord.com/developers/docs/reference#snowflakes|Discord}
 * @namespace discord.snowflake
 * @module discord.snowflake
 * @memberof discord
 */
const snowflake = {
  /**
   * Generates a snowflake from a timestamp.
   * <info>This hardcodes the worker ID as 1 and the process ID as 0.</info>
   * Alternatively, you can also perform this action directly using internals (less performant):
   * vizality.modules.webpack.getModule('DISCORD_EPOCH').default.fromTimestamp(new Date())
   * Sourced from @see {@link https://discord.js.org|discord.js}
   * @param {number|Date} [timestamp=Date.now()] Timestamp or date of the snowflake to generate
   * @returns {snowflake} Generated snowflake
   */
  getSnowflake: (timestamp = Date.now()) => {
    let INCREMENT = 0;

    try {
      // Check if timestamp is a date
      if (timestamp instanceof Date) timestamp = timestamp.getTime();

      // Check if timestamp is a number
      if (typeof timestamp !== 'number' || isNaN(timestamp)) {
        throw new TypeError(`
          "timestamp" argument must be a number (received ${isNaN(timestamp) ? 'NaN' : typeof timestamp})`
        );
      }

      if (INCREMENT >= 4095) INCREMENT = 0;

      const BINARY = `${snowflake._pad((timestamp - EPOCH).toString(2), 42)}0000100000${snowflake._pad((INCREMENT++).toString(2), 12)}`;

      return Long.fromString(BINARY, 2).toString();
    } catch (err) {
      return error(_module, `${_submodule}:getSnowflake`, null, err);
    }
  },

  /**
   * Deconstructs a snowflake.
   * Sourced from @see {@link https://discord.js.org|discord.js}
   * @param {snowflake} snow Snowflake to deconstruct
   * @returns {DeconstructedSnowflake} Deconstructed snowflake
   */
  getDeconstructedSnowflake: (snow) => {
    try {
      // Check if the snowflake is a string
      if (typeof snow !== 'string') {
        // Check if the user ID is null, because typeof null is 'object' in Javascript...
        throw new TypeError(`"snow" argument must be a string (received ${snow === null ? 'null' : typeof snow})`);
      }

      const BINARY = snowflake._pad(Long.fromString(snow).toString(2), 64);

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
      return error(_module, `${_submodule}:getDeconstructedSnowflake`, null, err);
    }
  },

  /**
   * Breaks the snowflake down into binary.
   * @param {snowflake} snow Snowflake
   * @returns {Date} Date
   */
  getBinary: (snow) => {
    try {
      // Check if the snowflake is a string
      if (typeof snow !== 'string') {
        // Check if the snowflake is null, because typeof null is 'object' in Javascript...
        throw new TypeError(`"snowflake" argument must be a string (received ${snow === null ? 'null' : typeof snow})`);
      }

      return snowflake.getDeconstructedSnowflake(snow).binary;
    } catch (err) {
      return error(_module, `${_submodule}:getBinary`, null, err);
    }
  },

  /**
   * Extracts a date from the snowflake.
   * @param {snowflake} snow Snowflake
   * @returns {Date} Date
   */
  getDate: (snow) => {
    try {
      // Check if the snowflake is a string
      if (typeof snow !== 'string') {
        // Check if the snowflake is null, because typeof null is 'object' in Javascript...
        throw new TypeError(`"snowflake" argument must be a string (received ${snow === null ? 'null' : typeof snow})`);
      }

      return snowflake.getDeconstructedSnowflake(snow).date;
    } catch (err) {
      return error(_module, `${_submodule}:getDate`, null, err);
    }
  },

  /**
   * Extracts a timestamp from the snowflake.
   * @param {snowflake} snow Snowflake
   * @returns {timestamp} Timestamp
   */
  getTimestamp: (snow) => {
    try {
      // Check if the snowflake is a string
      if (typeof snow !== 'string') {
        // Check if the snowflake is null, because typeof null is 'object' in Javascript...
        throw new TypeError(`"snowflake" argument must be a string (received ${snow === null ? 'null' : typeof snow})`);
      }

      return snowflake.getDeconstructedSnowflake(snow).timestamp;
    } catch (err) {
      return error(_module, `${_submodule}:getTimestamp`, null, err);
    }
  },

  /** @private */
  _pad: (v, n, c = '0') => {
    return String(v).length >= n ? String(v) : (String(c).repeat(n) + v).slice(-n);
  }
};

module.exports = snowflake;
