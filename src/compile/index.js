// const prompt = require('prompt');
const readline = require('readline');
const { writeFile, existsSync } = require('fs');
const { render } = require('sass');
const { join } = require('path');

// Command was initiated from
const args = process.argv.slice(2);

// Check if they provided at least 1 argument
if (args.length < 1) {
  console.log('"source file" is a required argument. Example usage: `npm run compile-sass style.scss main.css`');
}

// Use array destructuring here to set args[0] to args[1] if only 1 argument is provided
if (args.length === 1) {
  const output = args.toString();
  args[1] = `${output.substring(0, output.length - 5)}.css`;
}

// Directory the command was initiated from
const dir = process.env.INIT_CWD;
// Input scss file
const input = join(dir, args[0]);
// Output css file
const output = join(dir, args[1]);

const compileCSS = (data) => {
  console.log('\x1b[1m\x1b[34mACTION: \x1b[0mCompiling...');
  writeFile(output, data, 'utf8', (err) => {
    if (err) throw err;
    console.log('\x1b[32mSUCCESS: \x1b[0mThe file has been successfully compiled and written!');
  });
};

render({
  file: input,
  outFile: output,
  outputStyle: args[2] || 'expanded'
}, (err, result) => {
  if (err) throw err;
  if (result) {
    if (existsSync(output)) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question(`\x1b[1m\x1b[33mWARNING: \x1b[0mFile ${output} already exists.\nAre you sure you want to overwrite? (\x1b[32my\x1b[0m/\x1b[1m\x1b[31mn\x1b[0m)\n`, (yesNo) => {
        if (yesNo.toLowerCase() !== 'y' && yesNo.toLowerCase() !== 'n' && yesNo.toLowerCase() !== 'yes' && yesNo.toLowerCase() !== 'no') {
          console.log('\x1b[1m\x1b[31mERROR: \x1b[0mInvalid input. File compilation aborted.');
        }

        if (yesNo.toLowerCase() === 'y' || yesNo.toLowerCase() === 'yes') {
          compileCSS(result.css.toString());
        }

        if (yesNo.toLowerCase() === 'n' || yesNo.toLowerCase() === 'no') {
          console.log('\x1b[32mSUCCESS: \x1b[0mFile compilation aborted.');
        }

        rl.close();
      });
    } else {
      compileCSS(result.css.toString());
    }
  }
});
