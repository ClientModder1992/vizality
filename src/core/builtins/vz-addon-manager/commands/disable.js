import { toPlural, toTitleCase } from '@vizality/util/string';

export default {
  command: 'disable',
  description: 'Disables a currently enabled addon, or disable all addons.',
  options: [
    { name: 'addonId', required: true },
    { name: 'all', required: true }
  ],
  executor (args, type) {
    let result;

    if (!args || !args.length) {
      return {
        send: false,
        result: `You must specify a ${type} to disable, or use \`all\` to disable all.`
      };
    }

    if (args[0].toLowerCase() === 'all') {
      vizality.manager[toPlural(type)].disableAll();
      return {
        send: false,
        result: `All ${toPlural(type)} have been disabled.`
      };
    }

    if (vizality.manager[toPlural(type)].isInstalled(args[0])) {
      if (!vizality.manager[toPlural(type)].isEnabled(args[0])) {
        result = `${toTitleCase(type)} \`${args[0]}\` is already disabled.`;
      } else {
        vizality.manager[toPlural(type)].disable(args[0]);
        result = `${toTitleCase(type)} \`${args[0]}\` has been disabled.`;
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
    if (args.length > 1) {
      return false;
    }

    const addons = vizality.manager[toPlural(type)].getEnabled();

    return {
      commands:
        addons
          .filter(addon => addon?.addonId?.includes(args[0]))
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
