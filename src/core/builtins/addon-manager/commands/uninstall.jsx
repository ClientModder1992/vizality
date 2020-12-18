const { string: { toPlural, toTitleCase } } = require('@vizality/util');

module.exports = {
  command: 'uninstall',
  description: 'Uninstalls an addon.',
  usage: '{c} <addon ID>',
  executor (args, type) {
    let result;

    if (!args || !args.length) {
      return {
        send: false,
        result: `You must specify a ${type} to uninstall.`
      };
    }

    if (vizality.manager[toPlural(type)].isInstalled(args[0])) {
      vizality.manager[toPlural(type)].uninstall(args[0]);
    } else {
      result = `${toTitleCase(type)} \`${args[0]}\` is not installed.`;
    }

    return {
      send: false,
      result
    };
  },

  autocomplete (args, _, type) {
    const addons =
      vizality.manager[toPlural(type)].getAll()
        .sort((a, b) => a - b)
        .map(addon => vizality.manager[toPlural(type)].get(addon));

    if (args.length > 1) {
      return false;
    }

    return {
      commands:
        addons
          .filter(addon => addon && addon.addonId.includes(args[0]))
          .map(addon => ({
            command: addon.addonId,
            description: addon.manifest.description
          })),
      header: `Vizality Installed ${toTitleCase(toPlural(type))}`
    };
  }
};
