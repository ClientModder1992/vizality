import { existsSync, lstatSync } from 'fs';
import { join } from 'path';

import { toPlural, toTitleCase } from '@vizality/util/string';
import { toSentence } from '@vizality/util/array';
import { Directories } from '@vizality/constants';

export default {
  command: 'install',
  description: 'Installs an addon.',
  icon: 'vz-asset://svg/CloudDownload.svg',
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
      args = [ args ].flat();
      let addonIds = [];
      for (let addon of args) {
        let addonId;
        for (const _addon of community) {
          if (addon === _addon) {
            addonId = addon;
            break;
          }
        }

        if (!addonId) {
          if (!new RegExp(/^(((https?:\/\/)(((([a-zA-Z0-9][a-zA-Z0-9\-_]{1,252})\.){1,8}[a-zA-Z]{2,63})\/))|((ssh:\/\/)?git@)(((([a-zA-Z0-9][a-zA-Z0-9\-_]{1,252})\.){1,8}[a-zA-Z]{2,63})(:)))([a-zA-Z0-9][a-zA-Z0-9_-]{1,36})(\/)([a-zA-Z0-9][a-zA-Z0-9_-]{1,36})((\.git)?)$/).test(addon)) {
            return {
              send: false,
              result: 'You must provide a valid GitHub repository URL or an addon ID from <https://github.com/vizality-community>!'
            };
          }
        }

        // The URL must end in git to get processed by isomorphic-git below
        if (!addon.endsWith('.git')) {
          addon = `${addon}.git`;
        }

        addonId = addonId || addon.split('.git')[0].split('/')[addon.split('.git')[0].split('/').length - 1];

        if (vizality.manager[toPlural(type)].isInstalled(addonId)) {
          return {
            send: false,
            result: `${toTitleCase(type)} \`${addonId}\` is already installed!`
          };
        }

        if (existsSync(join(Directories.PLUGINS, addonId)) && lstatSync(join(Directories.PLUGINS, addonId)).isDirectory()) {
          return {
            send: false,
            result: `${toTitleCase(type)} directory \`${addonId}\` already exists!`
          };
        }

        try {
          await vizality.manager[toPlural(type)].install(addon);
          addonIds.push(addonId);
        } catch (err) {
          console.log('poo');
        }
      }
      addonIds = addonIds.map(addonId => `\`${addonId}\``);
      result = `${args.length > 1 ? toPlural(toTitleCase(type)) : toTitleCase(type)} ${toSentence(addonIds)} ${addonIds.length > 1 ? 'have' : 'has'} been installed!`;
    } catch (err) {
      result = err;
    }

    return {
      send: false,
      result
    };
  }
};
