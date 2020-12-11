const { FormTitle, Anchor } = require('@vizality/components');
const { React } = require('@vizality/react');

module.exports = {
  command: 'settings',
  description: 'Shows the settings options for a plugin.',
  usage: '{c} [ plugin ID ]',
  async executor (args) {
    let result = {};

    if (vizality.manager.plugins.plugins.has(args[0])) {
      if (!vizality.manager.plugins.isEnabled(args[0])) {
        result = {
          title: 'Error',
          description: `Plugin "${args[0]}" is disabled.`
        };
      }
      if (vizality.api.settings.tabs[args[0]]?.settings) {
        const Settings = vizality.api.settings.tabs[args[0]]?.settings;
        const plugin = vizality.manager.plugins.get(args[0]);

        result = {
          color: parseInt(plugin.manifest.color.replace(/^#/, ''), 16) || null,
          provider: {
            name: <>
              <FormTitle tag='h2' className='vz-addon-manager-command-addon-settings-header'>
                Settings
              </FormTitle>
              <Settings />
            </>
          },
          footer: {
            text: <Anchor
              href={`${window.location.origin}/vizality/dashboard/plugins/${args[0]}`}
              onClick={e => {
                e.preventDefault();
                vizality.api.router.navigate(`/vizality/dashboard/plugins/${args[0]}`);
              }}
            >{plugin.manifest.name}</Anchor>,
            icon_url: plugin.manifest.icon
          }
        };
      }
    } else {
      result = {
        title: 'Error',
        description: `Plugin "${args[0]}" is not installed.`
      };
    }

    return {
      send: false,
      result: {
        ...result,
        type: 'rich'
      }
    };
  },
  autocomplete (args) {
    const plugins =
      vizality.manager.plugins.getAllEnabled()
        .sort((a, b) => a - b)
        .map(plugin => vizality.manager.plugins.get(plugin));

    if (args.length > 1) return false;

    return {
      commands:
        plugins
          .filter(plugin => plugin && plugin.addonId.includes(args[0]) && vizality.api.settings.tabs[plugin.addonId]?.settings)
          .map(plugin => ({
            command: plugin.addonId,
            description: plugin.manifest.description
          })),
      header: 'Vizality Plugin Settings'
    };
  }
};
