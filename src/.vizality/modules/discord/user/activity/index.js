const { logger: { log, warn, error } } = require('@utilities');
const { getModule } = require('@webpack');

const action = require('./action');

const _module = 'Module';
const _submodule = `Discord:User:Activity`;

/**
 * User activity module.
 * Contains functions/data relating to user activities.
 * @namespace discord.user.activity
 * @module discord.user.activity
 * @memberof discord.user
 */
const activity = {
  action,


};

module.exports = activity;
