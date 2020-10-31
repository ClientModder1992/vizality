module.exports = {
  command: 'disable',
  description: 'Disables a currently enabled plugin.',
  usage: '{c} [ plugin ID ]',
  executor (args) {
    let result = {};

    if (vizality.manager.plugins.has(args[0])) {
      if (args[0] === 'vz-commands') {
        result = {
          title: 'Error',
          description: `Plugin "${args[0]}" is already disabled.`
        };
      } else if (!vizality.manager.plugins.isEnabled(args[0])) {
        result = {
          title: 'Error',
          description: `Plugin "${args[0]}" is already disabled.`
        };
      } else {
        vizality.manager.plugins.disable(args[0]);
        result = {
          title: 'Success',
          description: `Plugin "${args[0]}" has been disabled.`
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
      vizality.manager.plugins.getAllEnabled()
        .sort((a, b) => a - b)
        .map(plugin => vizality.manager.plugins.get(plugin));

    if (args.length > 1) {
      return false;
    }

    return {
      commands:
        plugins
          // @todo Consider adding !plugin.isInternal here once there are several non-core plugins available.
          .filter(plugin => plugin && !plugin.isInternal && plugin.entityID.includes(args[0]))
          .map(plugin => ({
            command: plugin.entityID,
            description: plugin.manifest.description
          })),
      header: 'Vizality Plugin List'
    };
  }
};
