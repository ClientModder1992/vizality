module.exports = {
  command: 'plugins',
  aliases: [ 'plist' ],
  description: 'Prints out a list of currently installed plugins.',
  usage: '{c}',
  executor () {
    const plugins = vizality.manager.plugins.getAll();
    const result = {
      type: 'rich',
      title: `List of Installed Plugins (${plugins.length})`,
      description: `\`${plugins.join('\n')}\``
    };

    return {
      send: false,
      result
    };
  }
};
