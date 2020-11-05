const { logger: { log, warn, error } } = require('@vizality/util');
const { getModule } = require('@vizality/webpack');

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
