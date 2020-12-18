const { react : { findInReactTree } } = require('@vizality/util');
const { patch, unpatch } = require('@vizality/patcher');
const { getModule } = require('@vizality/webpack');

module.exports = async () => {
  const Message = getModule(m => m.default?.displayName === 'Message');
  const memberModule = getModule('getMember');
  const guildModule = getModule('getGuild');

  patch('vz-attributes-messages', Message, 'default', (_, res) => {
    const props = findInReactTree(res, n => n.message);

    // Blocked messages
    if (!props) return res;

    const { message, channel } = props;

    if (!message || !channel) return res;

    // User-related
    res.props.children.props['vz-self'] = Boolean(message.author?.email) && '';
    res.props.children.props['vz-author-id'] = message.author?.id;
    res.props.children.props['vz-bot'] = Boolean(message.author?.bot) && '';
    res.props.children.props['vz-local'] = Boolean(message.author?.isLocalBot()) && '';
    res.props.children.props['vz-webhook'] = Boolean(message.webhookId) && '';
    res.props.children.props['vz-system'] = Boolean(message.type && message.type === 6) && '';
    res.props.children.props['vz-mentioned'] = Boolean(message.mentioned) && '';
    res.props.children.props['vz-member'] = Boolean(
      channel.guild_id &&
      memberModule.getMember(channel.guild_id, message.author.id) &&
      message.type === 0
    ) && '';
    res.props.children.props['vz-owner'] = Boolean(
      channel.guild_id &&
      message.author?.id === guildModule.getGuild(channel.guild_id) &&
      message.type === 0
    ) && '';
    // Message-related
    res.props.children.props['vz-message-id'] = message.id;
    res.props.children.props['vz-blocked'] = Boolean(message.blocked) && '';
    res.props.children.props['vz-embed'] = Boolean(message.embeds.length) && '';
    res.props.children.props['vz-attachment'] = Boolean(message.attachments.length) && '';

    return res;
  });

  return async () => unpatch('vz-attributes-messages');
};
