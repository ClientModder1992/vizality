module.exports = {
  command: 'disable',
  description: 'Allows you to disable a selected plugin from the given list.',
  usage: '{c} [ plugin ID ]',
  executor (args) {
    let result;

    if (vizality.manager.plugins.has(args[0])) {
      if (args[0] === 'vz-commands') {
        result = `->> ERROR: You cannot unload this plugin as it depends on delivering these commands!
            (Tried to unload ${args[0]})`;
      } else if (!vizality.manager.plugins.isEnabled(args[0])) {
        result = `->> ERROR: Tried to unload a non-loaded plugin!
            (${args[0]})`;
      } else {
        vizality.manager.plugins.disable(args[0]);
        result = `+>> SUCCESS: Plugin unloaded!
            (${args[0]})`;
      }
    } else {
      result = `->> ERROR: Tried to disable a non-installed plugin!
          (${args[0]})`;
    }

    return {
      send: false,
      result: `\`\`\`diff\n${result}\`\`\``
    };
  },

  autocomplete (args) {
    const plugins = vizality.manager.plugins.getAll()
      .sort((a, b) => a - b)
      .map(plugin => vizality.manager.plugins.get(plugin));

    if (!args[0] || args.length > 1) {
      return false;
    }

    return {
      commands: plugins
        .filter(plugin => plugin.entityID !== 'vz-commands' &&
          plugin.entityID.includes(args[0]))
        .map(plugin => ({
          command: plugin.entityID,
          description: plugin.manifest.description
        }))
        .slice(0, 10),
      header: 'vizality plugin list'
    };
  }
};
