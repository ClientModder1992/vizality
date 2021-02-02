import React from 'react';

import { toPlural, toTitleCase } from '@vizality/util/string';
import { FormTitle, Anchor } from '@vizality/components';

export default {
  command: 'settings',
  description: `Allows you to change an addon's settings directly in chat.`,
  addonIcon: true,
  options: [
    { name: 'addonId', required: true }
  ],
  async executor (args, type) {
    let result;

    if (!args || !args.length) {
      return {
        send: false,
        result: `You must specify a ${type} to manage its settings.`
      };
    }

    const addon = vizality.manager[toPlural(type)].get(args[0]);

    if (vizality.manager[toPlural(type)].isInstalled(args[0])) {
      if (!vizality.manager[toPlural(type)].isEnabled(args[0])) {
        return {
          send: false,
          result: `${toTitleCase(type)} \`${args[0]}\` is disabled.`
        };
      }
      if (vizality.manager[toPlural(type)].hasSettings(args[0])) {
        const Settings = addon.sections.settings.render;

        result = {
          color: type === 'plugin' ? 0x42ffa7 : 0xb68aff,
          provider: {
            name: <>
              <FormTitle tag='h2' className='vz-manager-command-addon-settings-header'>
                Settings
              </FormTitle>
              <Settings />
            </>
          },
          footer: {
            text: <Anchor
              href={`${window.location.origin}/vizality/${toPlural(type)}/${args[0]}`}
              onClick={e => {
                e.preventDefault();
                vizality.api.routes.navigate(`/vizality/${toPlural(type)}/${args[0]}`);
              }}
            >
              {addon.manifest.name}
            </Anchor>,
            icon_url: addon.manifest.icon
          }
        };
      }
    } else {
      return {
        send: false,
        result: `${toTitleCase(type)} \`${args[0]}\` is not installed.`
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
  autocomplete (args, _, type) {
    if (args.length > 1) return false;

    const addons =
      vizality.manager[toPlural(type)].getEnabledKeys()
        .sort((a, b) => a - b)
        .map(plugin => vizality.manager[toPlural(type)].get(plugin));

    return {
      commands:
        addons
          .filter(addon => addon?.addonId.includes(args[0]) && vizality.manager[toPlural(type)].hasSettings(addon?.addonId))
          .map(addon => ({
            command: addon.addonId,
            description: addon.manifest.description,
            icon: addon.manifest.icon,
            source: addon.manifest.name
          }))
    };
  }
};
