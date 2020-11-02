/**
 * Emoji module.
 * Contains functions/data relating to emojis.
 * @namespace discord.emoji
 * @module discord.emoji
 * @memberof discord
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
