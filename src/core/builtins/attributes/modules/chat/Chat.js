import { getOwnerInstance, findInReactTree } from '@vizality/util/react';
import { waitForElement } from '@vizality/util/dom';
import { patch, unpatch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';

// @test Set "this.props.isUnavailable" to true to test an unavailable channel

export default async () => {
  const { chat } = getModule('chat');
  const instance = getOwnerInstance(await waitForElement(`.${chat.split(' ')[0]}`));

  patch('vz-attributes-chat', instance.__proto__, 'render', function (_, res) {
    const Chat = findInReactTree(res, r => r.className === chat);

    if (!Chat) return res;

    const { channel, guild } = this.props;

    Chat['vz-guild-channel'] = Boolean([ 0, 2, 4, 5, 6 ].includes(channel?.type)) && '';
    Chat['vz-private-channel'] = Boolean([ 1, 3 ].includes(channel?.type)) && '';
    Chat['vz-group-channel'] = Boolean([ 3 ].includes(channel?.type)) && '';
    Chat['vz-text-channel'] = Boolean([ 0, 5 ].includes(channel?.type)) && '';
    Chat['vz-voice-channel'] = Boolean([ 2 ].includes(channel?.type)) && '';
    Chat['vz-news-channel'] = Boolean([ 5 ].includes(channel?.type)) && '';
    Chat['vz-rules-channel'] = Boolean(guild?.rulesChannelId === channel?.id) && '';
    Chat['vz-store-channel'] = Boolean([ 6 ].includes(channel?.type)) && '';
    Chat['vz-nsfw-channel'] = Boolean(channel?.nsfw) && '';
    Chat['vz-unavailable-channel'] = Boolean(channel?.isUnavailable) && '';

    const attributes = {
      'vz-search-results-active': this.props?.section && this.props?.section === 'SEARCH',
      'vz-message-editing-active': this.props?.isEditing,
      'vz-voice-call-active': this.props?.inCall,
      'vz-video-call-active': this.props?.hasVideo,
      'vz-modal-active': this.props?.hasModalOpen
    };

    const root = document.documentElement;

    const addAttributes = Object.keys(attributes).filter(m => attributes[m]);
    const removeAttributes = Object.keys(attributes).filter(m => !attributes[m]);

    addAttributes.forEach(attr => root.setAttribute(attr, ''));
    removeAttributes.forEach(attr => root.removeAttribute(attr));

    this.props?.channelId
      ? root.setAttribute('vz-channel-id', this.props.channelId)
      : root.removeAttribute('vz-channel-id');

    this.props?.guildId
      ? root.setAttribute('vz-guild-id', this.props.guildId)
      : root.removeAttribute('vz-guild-id');

    return res;
  });

  setImmediate(() => instance.forceUpdate());

  return () => unpatch('vz-attributes-chat');
};
