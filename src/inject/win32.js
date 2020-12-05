const { promises: { readdir } } = require('fs');
const { join } = require('path');

exports.getAppDir = async () => {
  const discordPath = join(process.env.LOCALAPPDATA, 'Discord');
  const discordDirectory = await readdir(discordPath);

  console.log('discordPath', discordPath);
  const currentBuild = discordDirectory
    .filter(path => path.startsWith('app-'))
    .reverse()[0];

  console.log('final', join(discordPath, currentBuild, 'resources', 'app'));
  return join(discordPath, currentBuild, 'resources', 'app');
};
