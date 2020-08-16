/**
 * User relationship action module.
 * Contains functions/data that perform user relationship-related actions.
 * @namespace discord.user.relationship.action
 * @module discord.user.relationship.action
 * @memberof discord.user.relationship
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
