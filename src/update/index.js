const { join } = require('path');
const { inject } = require('../inject/main');

const applicableEnvs = [ 'win32', 'darwin' ];

if (applicableEnvs.includes(process.platform)) {
  console.log('[Powercord] Detected an installation sensitive to host updates. Injecting into the updater');
  const injector = require(`../inject/${process.platform}`);
  const squirrelUpdateScript = join(require.main.filename, '../../app.asar', 'app_bootstrap/squirrelUpdate.js');

  const { restart: squirrelRestart } = require(squirrelUpdateScript);
  require.cache[squirrelUpdateScript].exports.restart = function (app, newVersion) {
    console.log('[Vizality] Injecting into the new version...');
    inject(injector).then(() => squirrelRestart(app, newVersion));
  };
}
