import { findInTree } from '@vizality/util/react';
import { patch, unpatch } from '@vizality/patcher';
import { toHash } from '@vizality/util/string';
import { getModule } from '@vizality/webpack';
import { Regexes } from '@vizality/constants';

export default () => {
  const Message = getModule('getElementFromMessageId')?.default;
  const memberModule = getModule('getMember');
  const guildModule = getModule('getGuild');

  patch('vz-attributes-messages', Message, 'type', (_, res) => {
    const props = findInTree(res, n => n && n.message && n.channel);

    // Blocked messages
    if (!props) return res;

    const { message, channel } = props;
    // User-related
    try {
      res.props['vz-bot-vizality'] = Boolean(message?.author?.phone === toHash('VIZALITY') && message?.author?.avatar !== 'clyde') && '';
      res.props['vz-bot-plugin'] = Boolean(message?.author?.phone === toHash('PLUGIN') && message?.author?.avatar !== 'clyde') && '';
      res.props['vz-user-id'] = new RegExp(Regexes.USER_ID).test(message?.author?.id) && message?.author?.id;
      res.props['vz-local'] = Boolean(message?.author?.isLocalBot ? message?.author?.isLocalBot() : null) && '';
      res.props['vz-mentioned'] = Boolean(message?.mentioned) && '';
      res.props['vz-self'] = Boolean(message?.author?.email) && '';
      res.props['vz-webhook'] = Boolean(message?.webhookId) && '';
      res.props['vz-bot'] = Boolean(message?.author?.bot) && '';
      res.props['vz-member'] = Boolean(
        channel?.guild_id &&
        memberModule.getMember(channel?.guild_id, message?.author.id) &&
        message?.type === 0
      ) && '';
      res.props['vz-owner'] = Boolean(
        channel?.guild_id &&
        message?.author?.id === guildModule.getGuild(channel?.guild_id) &&
        message?.type === 0
      ) && '';
      // Message-related
      res.props['vz-attachment'] = Boolean(message?.attachments?.length) && '';
      res.props['vz-embed'] = Boolean(message?.embeds?.length) && '';
      res.props['vz-blocked'] = Boolean(message?.blocked) && '';
      res.props['vz-message-id'] = message?.id;

      /**
       * Set an attribute for special types of messages.
       * @see {@link https://discord.com/developers/docs/resources/channel#message-object-message-types}
       */
      res.props['vz-type'] =
        (Boolean(message?.type === 1) && 'recipient-add') ||
        (Boolean(message?.type === 2) && 'recipient-remove') ||
        (Boolean(message?.type === 3) && 'call') ||
        (Boolean(message?.type === 4) && 'channel-name-change') ||
        (Boolean(message?.type === 5) && 'channel-icon-change') ||
        (Boolean(message?.type === 6) && 'pin') ||
        (Boolean(message?.type === 7) && 'member-join') ||
        (Boolean(message?.type === 8) && 'server-boost') ||
        (Boolean(message?.type === 9) && 'server-boost-tier-1') ||
        (Boolean(message?.type === 10) && 'server-boost-tier-2') ||
        (Boolean(message?.type === 11) && 'server-boost-tier-3') ||
        (Boolean(message?.type === 12) && 'follow') ||
        (Boolean(message?.type === 14) && 'discovery-disqualified') ||
        (Boolean(message?.type === 15) && 'discovery-requalified') ||
        (Boolean(message?.type === 19) && 'reply') ||
        (Boolean(message?.type === 20) && 'application-command');
    } catch (error) {
      error({ labels: [ 'vz-attributes-messages' ], message: [ 'Failed to inject message attributes!\n', error ] });
    }

    return res;
  });

  return () => unpatch('vz-attributes-messages');
};
