// Perform checks
require('./env_check')();

const { promises: { writeFile } } = require('fs');
const { resolve } = require('path');
const main = require('./main.js');

let platformModule;
try {
  platformModule = require(`./${process.platform}.js`);
} catch (err) {
  if (err.code === 'MODULE_NOT_FOUND') {
    console.log(`\x1b[1m\x1b[31mERROR: \x1b[0mUnsupported platform '${process.platform}'`);
    process.exit(1);
  }
}

(async () => {
  if (process.argv[2] === 'inject') {
    if (await main.inject(platformModule)) {
      // To show the announcement message
      await writeFile(
        resolve(__dirname, '..', '__injected.txt'),
        'Vizality successfully injected.'
      );

      console.log('\x1b[32mSUCCESS: \x1b[0mVizality has been injected!');
    }
  } else if (process.argv[2] === 'uninject') {
    if (await main.uninject(platformModule)) {
      console.log('\x1b[32mSUCCESS: \x1b[0mVizality has been uninjected.');
    }
  } else {
    console.log(`\x1b[1m\x1b[31mERROR: \x1b[0mUnsupported argument '${process.argv[2]}'`);
    process.exit(1);
  }
})().catch(e => console.error('\x1b[1m\x1b[31mERROR: \x1b[0mHmm, something seems to have gone wrong...', e));
