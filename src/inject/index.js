// Perform checks
require('./elevate');
require('./env_check')();

const { promises: { writeFile } } = require('fs');
const { join } = require('path');
const main = require('./main.js');

let platformModule;
try {
  platformModule = require(`./${process.platform}.js`);
} catch (err) {
  if (err.code === 'MODULE_NOT_FOUND') {
    console.log(`\x1b[1m\x1b[31mERROR: \x1b[0mUnsupported platform '${process.platform}'`);
    process.exit(process.argv.includes('--no-exit-codes') ? 0 : 1);
  }
}

(async () => {
  if (process.argv[2] === 'inject') {
    if (await main.inject(platformModule)) {
      if (!process.argv.includes('--no-welcome-message')) {
        await writeFile(join(__dirname, '..', '__injected.txt'));
      }

      // @todo: prompt to (re)start automatically
      console.log('\x1b[32mSUCCESS: \x1b[0mVizality has been injected!\n');
      console.log('You now have to completely close the Discord client, from the system tray or through the task manager.');
    }
  } else if (process.argv[2] === 'uninject') {
    if (await main.uninject(platformModule)) {
      // @todo: prompt to (re)start automatically
      console.log('\x1b[32mSUCCESS: \x1b[0mVizality has been uninjected!\n');
      console.log('You now have to completely close the Discord client, from the system tray or through the task manager.');
    }
  } else {
    console.log(`Unsupported argument "${process.argv[2]}", exiting.`);
    process.exit(process.argv.includes('--no-exit-codes') ? 0 : 1);
  }
})().catch(e => {
  if (e.code === 'EACCES') {
    // @todo This was linux only (?) so I assume this is now safe to delete.
    console.error('\x1b[1m\x1b[31mERROR: \x1b[0mHmm, something seems to have gone wrong...\n');
    console.log('Vizality wasn\'t able to inject itself due to missing permissions.\n');
    console.log('Try again with elevated permissions.');
  } else {
    console.error('\x1b[1m\x1b[31mERROR: \x1b[0mHmm, something seems to have gone wrong...\n');
  }
});
