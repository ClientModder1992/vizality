const { logger: { log, warn, error } } = require('@util');
const { getModule } = require('@webpack');

const action = require('./action');

const _module = 'Module';
const _submodule = `Discord:User:Relationship`;

/**
 * User relationship module.
 * Contains functions/data relating to user relationships.
 * @namespace discord.user.relationship
 * @module discord.user.relationship
 * @memberof discord.user
 */
const relationship = {
  action,


};

module.exports = relationship;
