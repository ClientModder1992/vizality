const { getModule, channels: { getChannelId } } = require('@webpack');
const { HTTP } = require('@constants');

module.exports = async function monkeypatchMessages () {
  const messages = await getModule('sendMessage', 'editMessage');

  const { BOT_AVATARS } = getModule('BOT_AVATARS');
  const { createBotMessage } = getModule('createBotMessage');

  // Create a new `BOT_AVATARS` key called 'vizality' which we'll later use to replace Clyde.
  BOT_AVATARS.vizality = `${HTTP.IMAGES}/logo.png`;

  messages.sendMessage = (sendMessage => async (id, message, ...params) => {
    if (!message.content.startsWith(vizality.api.commands.prefix)) {
      return sendMessage(id, message, ...params);
    }

    const [ cmd, ...args ] = message.content.slice(vizality.api.commands.prefix.length).split(' ');
    const command = vizality.api.commands.find(c => [ c.command, ...(c.aliases || []) ].includes(cmd.toLowerCase()));
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
        receivedMessage.author.username = result.username || 'Vizality';
        receivedMessage.author.avatar = 'vizality';

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

      return (messages.receiveMessage(receivedMessage.channel_id, receivedMessage), delete BOT_AVATARS[result.avatar_url]);
    }

    return sendMessage(id, message, ...params);
  })(this.oldSendMessage = messages.sendMessage);
};
