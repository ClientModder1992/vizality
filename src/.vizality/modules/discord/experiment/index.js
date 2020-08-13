/**
 * Experiment module.
 * Contains functions/data relating to Discord's Experiments.
 *
 * @module discord.experiment
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
