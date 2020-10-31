const { react : { findInReactTree }, joinClassNames } = require('@util');
const { patch, unpatch } = require('@patcher');
const { getModule } = require('@webpack');

module.exports = async () => {
  const Message = getModule(m => m.default && m.default.displayName === 'Message');
  const currentUserId = getModule('getId').getId();
  const memberModule = getModule('getMember');
  const guildModule = getModule('getGuild');

  patch('vz-utility-classes-messages', Message, 'default', (_, res) => {
    const msg = findInReactTree(res, n => n.message);

    if (!msg) {
      if (findInReactTree(res, n => n.className && !n.className.startsWith('blockedSystemMessage'))) {
        res.props.children.props.className = joinClassNames(res.props.children.props.className, 'vz-isBlockedMessage');
      }
      return res;
    }

    const { message, channel } = msg;

    res.props.children.props['vz-message-type'] = message.type;
    res.props.children.props['vz-author-id'] = message.author.id;

    res.props.children.props.className = joinClassNames(
      res.props.children.props.className, {
        'vz-isBotUser': message.author.bot,
        'vz-isCurrentUser': (message.author.id === currentUserId && message.type === 0),
        'vz-isGuildOwner': (channel && channel.guild_id && message.author.id === guildModule.getGuild(channel.guild_id) && message.type === 0),
        'vz-isGuildMember': (channel && channel.guild_id && memberModule.getMember(channel.guild_id, message.author.id) && message.type === 0),
        'vz-hasAttachments': message.attachments.length,
        'vz-hasEmbeds': message.embeds.length,
        'vz-isMentioned': message.mentioned,
        'vz-isSystemMessage': (message.type && message.type === 6)
      });

    return res;
  });

  return async () => unpatch('vz-utility-classes-messages');
};
