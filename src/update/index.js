const { join } = require('path');

const { inject } = require('../injectors/main');

const applicableEnvs = [ 'win32', 'darwin' ];

if (applicableEnvs.includes(process.platform)) {
  console.log('[Vizality] Detected an installation sensitive to host updates. Injecting into the updater');
  const injector = require(`../inject/${process.platform}`);
  let squirrelUpdateScript = join(require.main.filename, '..', 'squirrelUpdate.js');
  let squirrelRestart;
  try {
    squirrelRestart = require(squirrelUpdateScript).restart;
  } catch {
    squirrelUpdateScript = join(require.main.filename, '../../app.asar', 'app_bootstrap/squirrelUpdate.js');
    squirrelRestart = require(squirrelUpdateScript).restart;
  }
  require.cache[squirrelUpdateScript].exports.restart = function (app, newVersion) {
    console.log('[Vizality] Injecting in the new version');
    inject(injector).then(() => squirrelRestart(app, newVersion));
  };
}
