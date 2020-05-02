const { resolve } = require('path');
const { execSync } = require('child_process');

module.exports = () => {
  // Don't clone in System32
  if (__dirname.toLowerCase().replace(/\\/g, '/').includes('/windows/system32/')) {
    console.error('Powercord shouldn\'t be cloned in System32, as this will generate conflicts and bloat your Windows installation. Please remove it and clone it in another place.\n' +
      'Note: Not opening cmd as administrator will be enough.');
    process.exit(1);
  }

  // Verify if we're on node 10.x
  const fs = require('fs');
  if (!fs.promises) {
    console.error('You\'re on an outdated Node.js version. Powercord requires you to run at least Node 10. You can download it here: https://nodejs.org');
    process.exit(1);
  }

  // Verify if deps have been installed. If not, install them automatically
  /*
   * const { dependencies } = require('../package.json');
   *
   * try {
   *   for (const dependency in dependencies) {
   *     // noinspection JSUnfilteredForInLoop
   *     require(dependency);
   *   }
   * } catch (_) {
   *   console.log('Some dependencies are not installed. Let\'s fix that...');
   *   execSync('npm install --only=prod', {
   *     cwd: resolve(__dirname, '..'),
   *     stdio: [ null, null, null ]
   *   });
   * }
   */
};
