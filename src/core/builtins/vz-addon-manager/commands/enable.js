import { toPlural, toTitleCase } from '@vizality/util/string';

export default {
  command: 'enable',
  description: 'Enables a currently disabled addon, or enable all addons.',
  addonIcon: true,
  options: [
    { name: 'addonId', required: true },
    { name: 'all', required: true }
  ],
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
  autocomplete (args, type) {
    if (args.length > 1) return false;

    const addons =
      vizality.manager[toPlural(type)].getDisabledKeys()
        .sort((a, b) => a - b)
        .map(plugin => vizality.manager[toPlural(type)].get(plugin));

    return {
      commands:
        addons
          .filter(addon => addon?.addonId.includes(args[0]))
          .map(addon => ({
            command: addon.addonId,
            description: addon.manifest.description,
            icon: addon.manifest.icon,
            source: addon.manifest.name
          }))
          .concat({
            command: 'all',
            description: `Disables all ${toPlural(type)}.`
          })
    };
  }
};
