const { string: { toPlural, toTitleCase } } = require('@vizality/util');

module.exports = {
  command: 'enable',
  description: 'Enables a currently disabled addon, or enable all addons.',
  usage: '{c} <addon ID>',
  executor (args, type) {
    let result;

    if (!args || !args.length) {
      return {
        send: false,
        result: `You must specify a ${type} to enable, or use \`all\` to enable all.`
      };
    }

    if (vizality.manager[toPlural(type)].isInstalled(args[0])) {
      if (vizality.manager[toPlural(type)].isEnabled(args[0])) {
        result = `${toTitleCase(type)} \`${args[0]}\` is already enabled.`;
      } else {
        vizality.manager[toPlural(type)].enable(args[0]);
        result = `${toTitleCase(type)} \`${args[0]}\` has been enabled.`;
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
      vizality.manager[toPlural(type)].getAllDisabled()
        .sort((a, b) => a - b)
        .map(addon => vizality.manager[toPlural(type)].get(addon));

    if (args.length > 1) return false;

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
            description: `Enables all ${toPlural(type)}.`
          }),
      header: `Vizality Disabled ${toTitleCase(toPlural(type))}`
    };
  }
};
