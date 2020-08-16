/**
 * User profile modal module.
 * Contains functions/data relating to user profile modals.
 * @namespace discord.modal.userProfile
 * @module discord.modal.userProfile
 * @memberof discord.modal
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
