/**
 * User relationship module.
 * Contains functions/data relating to user relationships.
 * @namespace discord.user.relationship
 * @module discord.user.relationship
 * @memberof discord.user
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
