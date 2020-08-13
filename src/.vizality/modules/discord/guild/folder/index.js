/**
 * Guild folder module.
 * Contains functions/data relating to guild folders.
 *
 * @module discord.guild.folder
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
