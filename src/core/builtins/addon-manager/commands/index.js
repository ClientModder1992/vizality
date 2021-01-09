import uninstall from './uninstall';
import settings from './settings';
import install from './install';
import disable from './disable';
import enable from './enable';
import reload from './reload';
import manage from './manage';
import list from './list';

export const commands = { uninstall, settings, install, disable, enable, reload, manage, list };

export function getSettings () {
  return vizality.manager.builtins.get('addon-manager').settings;
}

export function registerCommands (type) {
  vizality.api.commands.registerCommand({
    command: type,
    description: `Commands related to ${type}s.`,
    subCommandPath: [ 'user', 'get' ],
    options: [
      {
        name: 'user',
        description: 'Get or edit permissions for a user',
        type: 2, // 2 is type SUB_COMMAND_GROUP
        options: [
          {
            name: 'get',
            description: 'Get permissions for a user',
            type: 1, // 1 is type SUB_COMMAND
            options: [
              {
                name: 'user',
                description: 'The user to get',
                type: 6, // 6 is type USER
                required: true
              },
              {
                name: 'channel',
                description: 'The channel permissions to get. If omitted, the guild permissions will be returned',
                type: 7, // 7 is type CHANNEL
                required: false
              }
            ]
          },
          {
            name: 'edit',
            description: 'Edit permissions for a user',
            type: 1,
            options: [
              {
                name: 'user',
                description: 'The user to edit',
                type: 6,
                required: true
              },
              {
                name: 'channel',
                description: 'The channel permissions to edit. If omitted, the guild permissions will be edited',
                type: 7,
                required: false
              }
            ]
          }
        ]
      },
      {
        name: 'role',
        description: 'Get or edit permissions for a role',
        type: 2,
        options: [
          {
            name: 'get',
            description: 'Get permissions for a role',
            type: 1,
            options: [
              {
                name: 'role',
                description: 'The role to get',
                type: 8, // 8 is type ROLE
                required: true
              },
              {
                name: 'channel',
                description: 'The channel permissions to get. If omitted, the guild permissions will be returned',
                type: 7,
                required: false
              }
            ]
          },
          {
            name: 'edit',
            description: 'Edit permissions for a role',
            type: 1,
            options: [
              {
                name: 'role',
                description: 'The role to edit',
                type: 8,
                required: true
              },
              {
                name: 'channel',
                description: 'The channel permissions to edit. If omitted, the guild permissions will be edited',
                type: 7,
                required: false
              }
            ]
          }
        ]
      }
    ],
    executor: args => {
      const subcommand = commands[args[0]];
      if (!subcommand) {
        return {
          send: false,
          result: `\`${args[0]}\` is not a valid subcommand. Specify one of ${Object.keys(commands).map(cmd => `\`${cmd}\``).join(', ')}.`
        };
      }

      return subcommand.executor(args.slice(1), type);
    },
    autocomplete: args => {
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

      return subcommand.autocomplete(args.slice(1), this.getSettings(), type);
    }
  });
}

export function unregisterCommands () {
  for (const subcommand of this.getSettings().getKeys()) {
    this.unregisterCommand(subcommand);
  }
}

export function unregisterCommand (name) {
  vizality.api.commands.unregisterCommand(name);
}
