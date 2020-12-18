const commands = {
  uninstall: require('./uninstall'),
  settings: require('./settings'),
  install: require('./install'),
  disable: require('./disable'),
  enable: require('./enable'),
  manage: require('./manage'),
  list: require('./list')
};

const Commands = module.exports = {
  getSettings () {
    return vizality.manager.builtins.get('addon-manager').settings;
  },

  registerCommands (type) {
    vizality.api.commands.registerCommand({
      command: type,
      description: `Commands related to ${type}s.`,
      usage: '{c} <disable|enable|settings|list>',
      executor: (args) => {
        const subcommand = commands[args[0]];
        if (!subcommand) {
          return {
            send: false,
            result: `\`${args[0]}\` is not a valid subcommand. Specify one of ${Object.keys(commands).map(cmd => `\`${cmd}\``).join(', ')}.`
          };
        }

        return subcommand.executor(args.slice(1), type);
      },
      autocomplete: (args) => {
        if (args[0] !== void 0 && args.length === 1) {
          return {
            commands: Object.values(commands).filter(({ command }) => command.includes(args[0].toLowerCase())),
            header: `${type} Subcommands`
          };
        }

        const subcommand = commands[args[0]];
        if (!subcommand || !subcommand.autocomplete) {
          return false;
        }

        return subcommand.autocomplete(args.slice(1), Commands.getSettings(), type);
      }
    });
  },

  unregisterCommands () {
    for (const subcommand of Commands.getSettings().getKeys()) {
      Commands.unregisterCommand(subcommand);
    }
  },

  unregisterCommand (name) {
    vizality.api.commands.unregisterCommand(name);
  }
};
