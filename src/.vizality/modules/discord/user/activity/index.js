/**
 * User activity module.
 * Contains functions/data relating to user activities.
 *
 * @module discord.user.activity
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
