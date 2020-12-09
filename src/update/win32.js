const { join } = require('path');

const { inject } = require('../inject/main');

if (process.platform === 'win32') { // Should be the only possible case, but we never know
  console.log('[Vizality] Injecting into Squirrel update script.');
  const injector = require(`../inject/${process.platform}`);
  console.log('injector', injector);
  let squirrelUpdateScript = join(require.main.filename, '..', 'squirrelUpdate.js');
  console.log('squirrelUpdateScript', squirrelUpdateScript);
  let squirrelRestart;
  try {
    squirrelRestart = require(squirrelUpdateScript).restart;
  } catch {
    squirrelUpdateScript = join(require.main.filename, '../../app.asar', 'app_bootstrap/squirrelUpdate.js');
    squirrelRestart = require(squirrelUpdateScript).restart;
  }
  require.cache[squirrelUpdateScript].exports.restart = (app, newVersion) => {
    console.log('[Vizality] Injecting in the new version');
    inject(injector).then(() => squirrelRestart(app, newVersion));
  };
}
