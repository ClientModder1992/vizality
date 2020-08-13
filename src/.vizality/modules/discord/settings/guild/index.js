/**
 * Guild settings module.
 * Contains functions/data relating to guild settings.
 *
 * @module discord.settings.guild
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
