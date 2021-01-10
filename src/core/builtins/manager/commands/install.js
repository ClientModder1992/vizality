import { toPlural, toTitleCase } from '@vizality/util/string';

export default {
  command: 'install',
  description: 'Installs an addon.',
  options: [
    { name: 'addonId', required: true }
  ],
  executor (args, type) {
    let result;

    if (!args || !args.length) {
      return {
        send: false,
        result: `You must specify a ${type} to install.`
      };
    }

    if (!vizality.manager[toPlural(type)].isInstalled(args[0])) {
      result = `This command feature isn't available quite yet.`;
    } else {
      result = `${toTitleCase(type)} \`${args[0]}\` is already installed.`;
    }

    return {
      send: false,
      result
    };
  }
};
