const { string: { toPlural, toTitleCase } } = require('@vizality/util');

module.exports = {
  command: 'install',
  description: 'Installs an addon.',
  usage: '{c} <addon ID>',
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
