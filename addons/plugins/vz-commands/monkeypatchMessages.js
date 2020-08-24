const Constants = require('@constants');
const Webpack = require('@webpack');

const { receiveMessage } = Webpack.messages;

async function monkeypatchMessages () {
  const { BOT_AVATARS } = Webpack.getModule('BOT_AVATARS');
  const { createBotMessage } = Webpack.getModule('createBotMessage');

  // Create a new `BOT_AVATARS` key called 'vizality' which we'll later use to replace Clyde.
  BOT_AVATARS.vizality = `${Constants.HTTP.IMAGES}/logo.png`;

  Webpack.messages.sendMessage = (sendMessage => async (id, message, ...params) => {
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
      const receivedMessage = createBotMessage(Webpack.channels.getChannelId(), '');

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

      return (receiveMessage(receivedMessage.channel_id, receivedMessage), delete BOT_AVATARS[result.avatar_url]);
    }

    return sendMessage(id, message, ...params);
  })(this.oldSendMessage = Webpack.messages.sendMessage);
}

module.exports = monkeypatchMessages;
