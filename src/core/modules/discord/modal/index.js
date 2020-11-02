/**
 * Modal module.
 * Contains functions/data relating to modals.
 * @namespace discord.modal
 * @module discord.modal
 * @memberof discord
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
