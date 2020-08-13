/**
 * User profile modal module.
 * Contains functions/data relating to user profile modals.
 *
 * @module discord.modal.userProfile
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
