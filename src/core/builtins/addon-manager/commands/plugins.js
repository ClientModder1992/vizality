module.exports = {
  command: 'plugins',
  aliases: [ 'plist' ],
  description: 'Displays a list of currently installed plugins.',
  usage: '{c}',
  executor () {
    const plugins = vizality.manager.plugins.getAll();
    const result = {
      type: 'rich',
      title: `Installed Plugins (${plugins.length})`,
      description: plugins.join('\n')
    };

    return {
      send: false,
      result
    };
  }
};
