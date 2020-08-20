/* eslint-disable brace-style */

/**
 * Discord module.
 * Contains all of the function/data that may be useful to allow
 * users and developers to interface more easily with Discord.
 * @namespace discord
 * @module discord
 * @version 0.0.1
 */
const User = require('./user');
const Snowflake = require('./snowflake');

class Discord {
  static get Snowflake () { return Snowflake; }
  static get User () { return User; }
}

module.exports = Discord;
