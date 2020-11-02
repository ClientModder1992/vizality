/**
 * Message reaction module.
 * Contains functions/data relating to message reactions.
 * @namespace discord.message.reaction
 * @module discord.message.reaction
 * @memberof discord.message
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
