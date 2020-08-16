/**
 * Modal action module.
 * Contains functions/data that perform generic modal-related actions.
 * @namespace discord.modal.action
 * @module discord.modal.action
 * @memberof discord.modal
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
