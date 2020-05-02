module.exports = {
  command: 'themes',
  aliases: [ 'tlist' ],
  description: 'Prints out a list of currently installed themes.',
  usage: '{c}',

  func () {
    const themes = [ ...powercord.styleManager.themes.values() ];
    const installedThemes = [];
    for (const theme of themes) {
      if (theme.isTheme) {
        installedThemes.push(theme.entityID);
      }
    }
    const result = {
      type: 'rich',
      title: `List of Installed Themes (${installedThemes.length})`,
      description: `\`${installedThemes.join('\n')}\``
    };

    return {
      send: false,
      result
    };
  }
};
