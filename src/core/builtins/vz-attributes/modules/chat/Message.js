import { findInReactTree } from '@vizality/util/react';
import { patch, unpatch } from '@vizality/patcher';
import { toHash } from '@vizality/util/string';
import { getModule } from '@vizality/webpack';
import { Regexes } from '@vizality/constants';

export default () => {
  const Message = getModule(m => m.default?.displayName === 'Message');
  const memberModule = getModule('getMember');
  const guildModule = getModule('getGuild');

  patch('vz-attributes-messages', Message, 'default', (_, res) => {
    const props = findInReactTree(res, n => n.message);

    // Blocked messages
    if (!props) return res;

    const { message, channel } = props;

    // User-related
    res.props.children.props['vz-bot-vizality'] = Boolean(message?.author?.phone === toHash('VIZALITY') && message?.author?.avatar !== 'clyde') && '';
    res.props.children.props['vz-bot-plugin'] = Boolean(message?.author?.phone === toHash('PLUGIN') && message?.author?.avatar !== 'clyde') && '';
    res.props.children.props['vz-user-id'] = new RegExp(Regexes.USER_ID).test(message?.author?.id) && message?.author?.id;
    res.props.children.props['vz-local'] = Boolean(message?.author?.isLocalBot()) && '';
    res.props.children.props['vz-mentioned'] = Boolean(message?.mentioned) && '';
    res.props.children.props['vz-self'] = Boolean(message?.author?.email) && '';
    res.props.children.props['vz-webhook'] = Boolean(message?.webhookId) && '';
    res.props.children.props['vz-bot'] = Boolean(message?.author?.bot) && '';
    res.props.children.props['vz-member'] = Boolean(
      channel?.guild_id &&
      memberModule.getMember(channel?.guild_id, message?.author.id) &&
      message?.type === 0
    ) && '';
    res.props.children.props['vz-owner'] = Boolean(
      channel?.guild_id &&
      message?.author?.id === guildModule.getGuild(channel?.guild_id) &&
      message?.type === 0
    ) && '';
    // Message-related
    res.props.children.props['vz-attachment'] = Boolean(message?.attachments?.length) && '';
    res.props.children.props['vz-embed'] = Boolean(message?.embeds?.length) && '';
    res.props.children.props['vz-blocked'] = Boolean(message?.blocked) && '';
    res.props.children.props['vz-message-id'] = message?.id;

    /**
     * Set an attribute for special types of messages.
     * @see {@link https://discord.com/developers/docs/resources/channel#message-object-message-types}
     */
    res.props.children.props['vz-type'] =
      (Boolean(message?.type && message?.type === 1) && 'recipient-add') ||
      (Boolean(message?.type && message?.type === 2) && 'recipient-remove') ||
      (Boolean(message?.type && message?.type === 3) && 'call') ||
      (Boolean(message?.type && message?.type === 4) && 'channel-name-change') ||
      (Boolean(message?.type && message?.type === 5) && 'channel-icon-change') ||
      (Boolean(message?.type && message?.type === 6) && 'pin') ||
      (Boolean(message?.type && message?.type === 7) && 'member-join') ||
      (Boolean(message?.type && message?.type === 8) && 'server-boost') ||
      (Boolean(message?.type && message?.type === 9) && 'server-boost-tier-1') ||
      (Boolean(message?.type && message?.type === 10) && 'server-boost-tier-2') ||
      (Boolean(message?.type && message?.type === 11) && 'server-boost-tier-3') ||
      (Boolean(message?.type && message?.type === 12) && 'follow') ||
      (Boolean(message?.type && message?.type === 14) && 'discovery-disqualified') ||
      (Boolean(message?.type && message?.type === 15) && 'discovery-requalified') ||
      (Boolean(message?.type && message?.type === 19) && 'reply') ||
      (Boolean(message?.type && message?.type === 20) && 'application-command');

    return res;
  });

  return () => unpatch('vz-attributes-messages');
};
