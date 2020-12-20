const { string: { toPlural, toTitleCase } } = require('@vizality/util');

module.exports = {
  command: 'reload',
  description: 'Reloads a currently enabled addon, or reload all addons.',
  usage: '{c} <addon ID | all>',
  executor: async (args, type) => {
    let result;

    if (!args || !args.length) {
      return {
        send: false,
        result: `You must specify a ${type} to reload, or use \`all\` to reload all.`
      };
    }

    if (args[0].toLowerCase() === 'all') {
      await vizality.manager[toPlural(type)].reloadAll();
      return {
        send: false,
        result: `All ${toPlural(type)} have been reloaded.`
      };
    }

    if (vizality.manager[toPlural(type)].isInstalled(args[0])) {
      if (!vizality.manager[toPlural(type)].isEnabled(args[0])) {
        result = `${toTitleCase(type)} \`${args[0]}\` is disabled.`;
      } else {
        await vizality.manager[toPlural(type)].reload(args[0]);
        result = `${toTitleCase(type)} \`${args[0]}\` has been reloaded.`;
      }
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
      vizality.manager[toPlural(type)].getAllEnabled()
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
          }))
          .concat({
            command: 'all',
            description: `Reloads all ${toPlural(type)}.`
          }),
      header: `Vizality Enabled ${toTitleCase(toPlural(type))}`
    };
  }
};
