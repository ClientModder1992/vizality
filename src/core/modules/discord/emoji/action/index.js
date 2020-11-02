/**
 * Emoji action module.
 * Contains functions/data that perform emoji-related actions.
 * @namespace discord.emoji.action
 * @module discord.emoji.action
 * @memberof discord.emoji
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
