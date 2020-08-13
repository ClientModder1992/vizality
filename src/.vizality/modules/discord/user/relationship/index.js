/**
 * User relationship module.
 * Contains functions/data relating to user relationships.
 *
 * @module discord.user.relationship
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
