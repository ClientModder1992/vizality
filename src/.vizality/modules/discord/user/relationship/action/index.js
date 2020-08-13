/**
 * User relationship action module.
 * Contains functions/data that perform user relationship-related actions.
 *
 * @module discord.user.relationship.action
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
