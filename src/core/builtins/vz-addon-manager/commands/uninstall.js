import { toPlural, toTitleCase } from '@vizality/util/string';

export default {
  command: 'uninstall',
  description: 'Uninstalls an addon.',
  icon: 'vz-asset://svg/Trash.svg',
  options: [
    { name: 'addonId', required: true }
  ],
  async executor (args, type) {
    let result;

    if (!args || !args.length) {
      return {
        send: false,
        result: `You must specify a ${type} to uninstall.`
      };
    }

    if (vizality.manager[toPlural(type)].isInstalled(args[0])) {
      try {
        return vizality.manager[toPlural(type)].uninstall(args[0]);
      } catch (err) {
        result = err;
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
      vizality.manager[toPlural(type)].keys
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
    };
  }
};
