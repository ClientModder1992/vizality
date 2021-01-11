import settings from './settings';
import manage from './manage';
import enable from './enable';
import disable from './disable';
import reload from './reload';
import list from './list';
import install from './install';
import uninstall from './uninstall';

export const commands = { uninstall, settings, install, disable, enable, reload, manage, list };

export function getSettings () {
  return vizality.manager.builtins.get('vz-addon-manager').settings;
}

export function registerCommands (type) {
  vizality.api.commands.registerCommand({
    command: type,
    description: `Commands related to ${type}s.`,
    options: [
      { name: 'settings', required: true },
      { name: 'manage', required: true },
      { name: 'enable', required: true },
      { name: 'disable', required: true },
      { name: 'reload', required: true },
      { name: 'list', required: true },
      { name: 'install', required: true },
      { name: 'uninstall', required: true }
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
          commands: Object.values(commands).filter(({ command }) => command.includes(args[0].toLowerCase()))
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
