import { getModule, channels } from '@vizality/webpack';
import { toHash } from '@vizality/util/string';
import { HTTP } from '@vizality/constants';

const { getChannelId } = channels;

/**
 * @note We use bot.phone below to set the phone property of the bot message
 * which we can use later (in vz-enhancements) to change the tag from BOT
 * to VIZALITY or PLUGIN.
 */

export default async function monkeypatchMessages () {
  const messages = await getModule('sendMessage', 'editMessage');
  const { createBotMessage } = getModule('createBotMessage');
  const { BOT_AVATARS } = getModule('BOT_AVATARS');

  // Create a new `BOT_AVATARS` key called 'vizality' which we'll later use to replace Clyde.
  BOT_AVATARS.vizality = 'vz-asset://images/logo.png';

  messages.sendMessage = (sendMessage => async (id, message, ...params) => {
    if (!message.content.startsWith(vizality.api.commands.prefix)) {
      return sendMessage(id, message, ...params);
    }

    const [ cmd, ...args ] = message.content.slice(vizality.api.commands.prefix.length).split(' ');
    const command = vizality.api.commands.find(c => [ c.command.toLowerCase(), ...(c.aliases?.map(alias => alias.toLowerCase()) || []) ].includes(cmd.toLowerCase()));
    if (!command) {
      return sendMessage(id, message, ...params);
    }

    const result = await command.executor(args, this);

    if (!result) {
      return;
    }

    if (result.send) {
      message.content = result.result;
    } else {
      const receivedMessage = createBotMessage(getChannelId(), '');

      if (vizality.settings.get('replaceClyde', true)) {
        const plugin = vizality.manager.plugins.get(command.origin);
        const username = command.username ||
        (plugin && plugin.manifest.name) ||
        'Vizality';

        let botAvatarName = 'vizality';
        let botPhone = toHash('VIZALITY');

        if (plugin) {
          BOT_AVATARS[plugin.addonId] = command.avatar || plugin.manifest.icon;
          botAvatarName = plugin.addonId;
          botPhone = toHash('PLUGIN');
        }

        const avatar = command.avatar ||
        (vizality.manager.plugins.get(command.origin) &&
         vizality.manager.plugins.get(command.origin).manifest.icon) ||
        'vz-asset://images/logo.png';

        BOT_AVATARS[botAvatarName] = avatar;

        receivedMessage.author.username = username;
        receivedMessage.author.avatar = botAvatarName;
        receivedMessage.author.phone = botPhone;

        if (result.avatar_url) {
          BOT_AVATARS[result.username] = result.avatar_url;
          receivedMessage.author.avatar = result.username;
        }
      }

      if (typeof result.result === 'string') {
        receivedMessage.content = result.result;
      } else {
        receivedMessage.embeds.push(result.result);
      }

      return (
        messages.receiveMessage(receivedMessage.channel_id, receivedMessage),
        delete BOT_AVATARS[result.avatar_url],
        // Restore the "default" Vizality username and avatar to Clyde if the setting is enabled
        vizality.settings.get('replaceClyde', true) && vizality.settings.set('clydeUsername', 'Vizality'),
        vizality.settings.get('replaceClyde', true) && vizality.settings.set('clydeAvatar', 'vz-asset://images/logo.png')
      );
    }

    return sendMessage(id, message, ...params);
  })(this.oldSendMessage = messages.sendMessage);
}
