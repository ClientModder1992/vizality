import { findInTree } from '@vizality/util/react';
import { patch, unpatch } from '@vizality/patcher';
import { toHash } from '@vizality/util/string';
import { getModule } from '@vizality/webpack';
import { Regexes } from '@vizality/constants';

export const labels = [ 'Chat' ];

const messageTypes = {
  1: 'recipient-add',
  2: 'recipient-remove',
  3: 'call',
  4: 'channel-name-change',
  5: 'channel-icon-change',
  6: 'pin',
  7: 'member-join',
  8: 'server-boost',
  9: 'server-boost-tier-1',
  10: 'server-boost-tier-2',
  11: 'server-boost-tier-3',
  12: 'follow',
  14: 'discovery-disqualified',
  15: 'discovery-requalified',
  19: 'reply',
  20: 'application-command'
};

const attributes = {
  'vz-bot-vizality': message => Boolean(message.author?.phone === toHash('VIZALITY') && message.author?.avatar !== 'clyde') && '',
  'vz-bot-plugin': message => Boolean(message.author?.phone === toHash('PLUGIN') && message.author?.avatar !== 'clyde') && '',
  'vz-user-id': message => new RegExp(Regexes.USER_ID).test(message.author?.id) && message.author?.id,
  'vz-local': message => Boolean(message.author?.isLocalBot ? message.author?.isLocalBot() : null) && '',
  'vz-mentioned': message => Boolean(message.mentioned) && '',
  'vz-self': message => Boolean(message.author?.email) && '',
  'vz-webhook': message => Boolean(message.webhookId) && '',
  'vz-bot': message => Boolean(message.author?.bot) && '',
  'vz-member': (message, channel, _, memberModule) => Boolean(
    channel?.guild_id &&
    memberModule.getMember(channel?.guild_id, message.author.id) &&
    message.type === 0
  ) && '',
  'vz-owner': (message, channel, guildModule) => Boolean(
    channel?.guild_id &&
    message.author?.id === guildModule.getGuild(channel?.guild_id) &&
    message.type === 0
  ) && '',
  /*
   * Message-related attributes.
   */
  'vz-attachment': message => Boolean(message.attachments?.length) && '',
  'vz-embed': message => Boolean(message.embeds?.length) && '',
  'vz-blocked': message => Boolean(message.blocked) && '',
  'vz-message-id': message => message.id,
  /**
   * Set an attribute for special types of messages.
   * @see {@link https://discord.com/developers/docs/resources/channel#message-object-message-types}
   */
  'vz-type': message => messageTypes[message.type.toString()]
};

export default main => {
  const Message = getModule(m => m?.default?.toString?.()?.search('childrenRepliedMessage') > -1);
  const memberModule = getModule('getMember');
  const guildModule = getModule('getGuild');
  patch('vz-attributes-messages', Message, 'default', (_, res) => {
    try {
      const props = findInTree(res, n => n?.message && n.channel);
      /*
       * Blocked messages have no props.
       */
      if (!props?.message) return;
      const { message, channel } = props;

      if (!res.props?.children?.props) throw 'children element was not found!';

      for (const attribute in attributes) {
        try {
          res.props.children.props[attribute] = attributes[attribute](message, channel, guildModule, memberModule);
        } catch (error) {
          main.error(main._labels.concat(labels.concat('Message')), `Failed to add attribute "${attribute}"!\n`, error);
        }
      }
    } catch (err) {
      return main.error(main._labels.concat(labels.concat('Message')), err);
    }
  });
  return () => unpatch('vz-attributes-messages');
};
