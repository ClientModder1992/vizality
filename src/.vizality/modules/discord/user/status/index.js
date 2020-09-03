const { logger: { log, warn, error } } = require('@utilities');
const { getModule } = require('@webpack');

const action = require('./action');

const _module = 'Module';
const _submodule = `Discord:User:Status`;

/**
 * User status module.
 * Contains functions/data relating to user statuses.
 * @namespace discord.user.status
 * @module discord.user.status
 * @memberof discord.user
 */
const status = {
  action,


};

module.exports = status;
