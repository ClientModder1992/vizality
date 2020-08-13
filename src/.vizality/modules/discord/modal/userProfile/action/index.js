/**
 * User profile modal action module.
 * Contains functions/data that perform user profile modal-related actions.
 *
 * @module discord.modal.userProfile.action
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
