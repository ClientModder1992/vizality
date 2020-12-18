module.exports = {
  command: 'help',
  aliases: [ 'h' ],
  description: 'Gives you a list of subcommands or information on a specific command.',
  usage: '{c} [command]',
  async executor ([ commandName ]) {
    let result;

    if (!commandName) {
      const getPropLength = (command) => command.command.length;

      const longestCommandName = getPropLength(
        vizality.api.commands.sort((a, b) => getPropLength(b) - getPropLength(a))[0]
      );

      result = {
        type: 'rich',
        title: 'List of Commands',
        description: vizality.api.commands
          .map(({ command, description }) =>
            `\`${command.padEnd((longestCommandName * 2) - command.length, ' \u200b')} |\` \u200b \u200b*${description}*`
          )
          .join('\n'),
        footer: {
          text: `Run ${vizality.api.commands.prefix}help <commandName> for more information regarding a specific command.`
        }
      };
    } else {
      const command = vizality.api.commands.find(c => [ c.command, ...(c.aliases || []) ].includes(commandName));
      if (!command) {
        result = `Command \`${commandName}\` not found.`;
      } else {
        result = {
          type: 'rich',
          title: `Help for ${commandName}`,
          description: command.description,
          fields: [ {
            name: 'Usage',
            value: `\`${command.usage.replace('{c}', vizality.api.commands.prefix + command.command)}\n\``,
            inline: false
          } ],
          footer: {
            text: `Inherited from "${command.origin}".`
          }
        };
      }
    }

    return {
      send: false,
      result
    };
  },
  autocomplete (args) {
    if (args.length > 1) {
      return false;
    }

    return {
      commands: vizality.api.commands.filter(command =>
        [ command.command, ...(command.aliases || []) ].some(commandName =>
          commandName.includes(args[0])
        )
      ),
      header: 'Vizality Command List'
    };
  }
};
