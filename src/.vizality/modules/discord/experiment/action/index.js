/**
 * Experiment action module.
 * Contains functions/data that perform experiment-related actions.
 *
 * @module discord.experiment.action
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
