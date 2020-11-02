/**
 * Discord module.
 * Contains all of the function/data that may be useful to allow
 * users and developers to interface more easily with Discord.
 * @namespace discord
 * @module discord
 * @version 0.0.1
 */
const user = require('./user');
const snowflake = require('./snowflake');

const discord = {
  user,
  snowflake
};

module.exports = discord;
