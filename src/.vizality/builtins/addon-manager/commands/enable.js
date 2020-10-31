module.exports = {
  command: 'enable',
  description: 'Enabled a currently disabled plugin.',
  usage: '{c} [ plugin ID ]',
  executor (args) {
    let result = {};

    if (vizality.manager.plugins.has(args[0])) {
      if (vizality.manager.plugins.isEnabled(args[0])) {
        result = {
          title: 'Error',
          description: `Plugin "${args[0]}" is already enabled.`
        };
      } else {
        vizality.manager.plugins.enable(args[0]);
        result = {
          title: 'Success',
          description: `Plugin "${args[0]}" has been enabled.`
        };
      }
    } else {
      result = {
        title: 'Error',
        description: `Plugin "${args[0]}" is not installed.`
      };
    }

    return {
      send: false,
      result: {
        ...result,
        type: 'rich'
      }
    };
  },
  autocomplete (args) {
    const plugins =
      vizality.manager.plugins.getAllDisabled()
        .sort((a, b) => a - b)
        .map(plugin => vizality.manager.plugins.get(plugin));

    if (args.length > 1) return false;

    return {
      commands:
        plugins
          .filter(plugin => plugin && plugin.entityID.includes(args[0]))
          .map(plugin => ({
            command: plugin.entityID,
            description: plugin.manifest.description
          })),
      header: 'Vizality Plugin List'
    };
  }
};
