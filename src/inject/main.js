const { promises: { mkdir, writeFile, existsSync } } = require('fs');
const { join, sep } = require('path');

const { removeDirRecursive } = require('../core/modules/util/file');

exports.inject = async ({ getAppDir }) => {
  const appDir = await getAppDir();
  if (existsSync(appDir)) {
    /*
     * @todo Verify if there is nothing in discord_desktop_core as well
     * @todo Prompt to automatically uninject and continue
     */
    console.log('Looks like you already have an injector in place. Try unplugging ("npm run uninject") and try again.', '\n');
    console.log(`\x1b[1m\x1b[33mWARNING: \x1b[0mIf you already have BetterDiscord or another client mod injected, Vizality cannot run along with it!`);
    return false;
  }

  await mkdir(appDir);
  await Promise.all([
    writeFile(
      join(appDir, 'index.js'),
      `require(\`${__dirname.replace(RegExp(sep.repeat(2), 'g'), '/')}/../src/patcher.js\`)`
    ),
    writeFile(
      join(appDir, 'package.json'),
      JSON.stringify({
        main: 'index.js',
        name: 'discord'
      })
    )
  ]);

  return true;
};

exports.uninject = async ({ getAppDir }) => {
  const appDir = await getAppDir();

  if (!existsSync(appDir)) {
    console.log('There is nothing to uninject. You are already running Discord without modifications.');
    return false;
  }

  await removeDirRecursive(appDir);
  return true;
};
