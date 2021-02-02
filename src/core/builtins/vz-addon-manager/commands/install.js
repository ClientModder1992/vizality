import { existsSync, lstatSync } from 'fs';
import { join } from 'path';

import { toPlural, toTitleCase } from '@vizality/util/string';
import { Directories } from '@vizality/constants';

export default {
  command: 'install',
  description: 'Installs an addon.',
  options: [
    { name: 'url', required: true },
    { name: 'addonId', required: true }
  ],
  async executor (args, type) {
    let result;
    try {
      /**
       * This is temporary until we get the API working to request this info from an endpoint.
       */
      const community = [ 'spotify-in-discord', 'copy-raw-message', 'better-code-blocks', 'status-everywhere', 'open-links-in-discord', 'example-plugin-settings', 'channel-members-activity-icons', 'bring-back-gamer-text', 'heyzere' ];

      let addonId;
      for (const addon of community) {
        if (args[0] === addon) {
          addonId = addon;
          break;
        }
      }

      if (!addonId) {
        if (!new RegExp(/^(((https?:\/\/)(((([a-zA-Z0-9][a-zA-Z0-9\-_]{1,252})\.){1,8}[a-zA-Z]{2,63})\/))|((ssh:\/\/)?git@)(((([a-zA-Z0-9][a-zA-Z0-9\-_]{1,252})\.){1,8}[a-zA-Z]{2,63})(:)))([a-zA-Z0-9][a-zA-Z0-9_-]{1,36})(\/)([a-zA-Z0-9][a-zA-Z0-9_-]{1,36})((\.git)?)$/).test(args[0])) {
          return {
            send: false,
            result: 'You must provide a valid GitHub repository URL or an addon ID from https://github.com/vizality-community!'
          };
        }
      }

      // The URL must end in git to get processed by isomorphic-git below
      if (!args[0].endsWith('.git')) {
        args[0] = `${args[0]}.git`;
      }

      addonId = addonId || args[0].split('.git')[0].split('/')[args[0].split('.git')[0].split('/').length - 1];

      if (vizality.manager[toPlural(type)].isInstalled(addonId)) {
        return {
          send: false,
          result: `${toTitleCase(type)} "${addonId}" is already installed!`
        };
      }

      if (existsSync(join(Directories.PLUGINS, addonId)) && lstatSync(join(Directories.PLUGINS, addonId)).isDirectory()) {
        return {
          send: false,
          result: `${toTitleCase(type)} directory "${addonId}" already exists!`
        };
      }

      await vizality.manager[toPlural(type)].install(args[0]);

      result = `${toTitleCase(type)} "${addonId}" has been installed!`;
    } catch (err) {
      console.log(err);
      result = 'poo';
    }

    return {
      send: false,
      result
    };
  }
};
