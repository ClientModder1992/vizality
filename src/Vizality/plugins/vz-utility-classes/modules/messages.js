const { inject, uninject } = require('vizality/injector');
const { getModule } = require('vizality/webpack');
const { react : { findInReactTree }, joinClassNames } = require('vizality/util');

module.exports = async () => {
  const Message  = await getModule(m => m.default && m.default.displayName === 'Message', true);
  const guildModule = await getModule([ 'getGuild' ], true);
  const memberModule = await getModule([ 'getMember' ], true);
  const currentUserId = (await getModule([ 'getId' ], true)).getId();

  inject('vz-utility-classes-messages', Message, 'default', (originalArgs, returnValue) => {
    const msg = findInReactTree(returnValue, n => n.message);

    if (!msg) {
      if (findInReactTree(returnValue, n => n.className && !n.className.startsWith('blockedSystemMessage'))) {
        returnValue.props.className = joinClassNames(returnValue.props.className, 'vz-isBlockedMessage');
      }
      return returnValue;
    }

    const { message, channel } = msg;

    returnValue.props['vz-message-type'] = message.type;
    returnValue.props['vz-author-id'] = message.author.id;

    returnValue.props.className = joinClassNames(
      returnValue.props.className, {
        'vz-isBotUser': message.author.bot,
        'vz-isCurrentUser': (message.author.id === currentUserId && message.type === 0),
        'vz-isGuildOwner': (channel && channel.guild_id && message.author.id === guildModule.getGuild(channel.guild_id) && message.type === 0),
        'vz-isGuildMember': (channel && channel.guild_id && memberModule.getMember(channel.guild_id, message.author.id) && message.type === 0),
        'vz-hasAttachments': message.attachments.length,
        'vz-hasEmbeds': message.embeds.length,
        'vz-isSystemMessage': (message.type && message.type === 6)
      });

    return returnValue;
  });

  return async () => uninject('vz-utility-classes-messages');
};
