const { execSync } = require('child_process');
const { existsSync } = require('fs');
const readline = require('readline');
const { join } = require('path');

const homedir = execSync('grep $(logname) /etc/passwd | cut -d ":" -f6').toString().trim();

const KnownLinuxPaths = Object.freeze([
  '/usr/share/discord-canary',
  '/usr/lib64/discord-canary',
  '/opt/discord-canary',
  '/opt/DiscordCanary',
  `${homedir}/.local/bin/DiscordCanary` // https://github.com/powercord-org/powercord/pull/370
]);

exports.getAppDir = async () => {
  const discordProcess = execSync('ps x')
    .toString()
    .split('\n')
    .map(s => s.split(' ').filter(Boolean))
    .find(p => p[4] && (/discord-?canary$/i).test(p[4]) && p.includes('--type=renderer'));

  if (!discordProcess) {
    let discordPath = KnownLinuxPaths.find(path => existsSync(path));
    if (!discordPath) {
      const readlineInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const askPath = () => new Promise(resolve => readlineInterface.question('> ', resolve));
      console.log('\x1b[1m\x1b[33mWARNING: \x1b[0mCannot find Discord process.');
      console.log('Please provide the path of your Discord installation folder');
      discordPath = await askPath();
      readlineInterface.close();

      if (!existsSync(discordPath)) {
        console.log('');
        console.log('The path you provided is invalid.');
        process.exit(process.argv.includes('--no-exit-codes') ? 0 : 1);
      }
    }

    return join(discordPath, 'resources', 'app');
  }

  const discordPath = discordProcess[4].split('/');
  discordPath.splice(discordPath.length - 1, 1);
  return join('/', ...discordPath, 'resources', 'app');
};
