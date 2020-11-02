/**
 * Popout module.
 * Contains functions/data relating to popouts.
 * @namespace discord.popout
 * @module discord.popout
 * @memberof discord
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
