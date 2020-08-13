/**
 * Emoji action module.
 * Contains functions/data that perform emoji-related actions.
 *
 * @module discord.emoji.action
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
