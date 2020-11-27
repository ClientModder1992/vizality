const { join } = require('path');
const { existsSync, promises } = require('fs');
const { execSync } = require('child_process');

const rootPath = join(__dirname, '..', '..');
const nodeModulesPath = join(rootPath, 'node_modules');

function installDeps () {
  console.log('\x1b[1m\x1b[34mACTION: \x1b[0mInstalling dependencies...');
  execSync('npm install --only=prod', {
    cwd: rootPath,
    stdio: [ null, null, null ]
  });
  console.log('\x1b[1m\x1b[34mACTION: \x1b[0mDependencies successfully installed!');
}

module.exports = () => {
  // Don't clone in System32
  if (__dirname.toLowerCase().replace(/\\/g, '/').includes('/windows/system32')) {
    console.error('\x1b[1m\x1b[31mERROR: \x1b[0mVizality shouldn\'t be cloned in System32, as this will generate conflicts and bloat your Windows installation. Please remove it and clone it in another place.\n' +
    '\x1b[1m\x1b[36mNOTE: \x1b[0mNot opening cmd as administrator will be enough.');
    process.exit(1);
  }

  // Verify if we're on node 10.x
  if (!promises) {
    console.error('\x1b[1m\x1b[31mERROR: \x1b[0mYou\'re on an outdated Node.js version. Vizality requires you to run at least Node 10. You can download it here: https://nodejs.org');
    process.exit(1);
  }

  // Verify if deps have been installed. If not, install them automatically
  if (!existsSync(nodeModulesPath)) {
    installDeps();
  } else {
    const { dependencies } = require('../../package.json');
    for (const dependency in dependencies) {
      const depPath = join(nodeModulesPath, dependency);
      if (!existsSync(depPath)) {
        installDeps();
        break;
      }
      const depPackage = require(join(depPath, 'package.json'));
      const expectedVerInt = parseInt(dependencies[dependency].replace(/[^\d]/g, ''));
      const installedVerInt = parseInt(depPackage.version.replace(/[^\d]/g, ''));
      if (installedVerInt < expectedVerInt) {
        installDeps();
        break;
      }
    }
  }
};
