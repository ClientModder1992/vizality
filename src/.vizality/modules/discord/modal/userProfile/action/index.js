/**
 * User profile modal action module.
 * Contains functions/data that perform user profile modal-related actions.
 * @namespace discord.modal.userProfile.action
 * @module discord.modal.userProfile.action
 * @memberof discord.modal.userProfile
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
