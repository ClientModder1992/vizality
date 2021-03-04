// @test Set "this.props.isUnavailable" to true to test an unavailable channel

import { getOwnerInstance, findInReactTree } from '@vizality/util/react';
import { waitForElement } from '@vizality/util/dom';
import { patch, unpatch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';

export const labels = [ 'Chat' ];

export default async main => {
  const { chat } = getModule('chat');
  const instance = getOwnerInstance(await waitForElement(`.${chat.split(' ')[0]}`));
  patch('vz-attributes-chat', instance?.__proto__, 'render', function (_, res) {
    try {
      const Chat = findInReactTree(res, r => r.className === chat);
      if (!Chat || !this?.props?.channel) return;
      const { channel, guild } = this.props;
      const chatProps = [];

      Boolean([ 0, 2, 4, 5, 6 ].includes(channel.type)) && chatProps.push('guild');
      Boolean([ 1, 3 ].includes(channel.type)) && chatProps.push('private');
      Boolean([ 3 ].includes(channel.type)) && chatProps.push('group');
      Boolean([ 0, 5 ].includes(channel.type)) && chatProps.push('text');
      Boolean([ 2 ].includes(channel.type)) && chatProps.push('voice');
      Boolean([ 5 ].includes(channel.type)) && chatProps.push('news');
      Boolean(guild?.rulesChannelId === channel.id) && chatProps.push('rules');
      Boolean([ 6 ].includes(channel.type)) && chatProps.push('store');
      Boolean(channel.nsfw) && chatProps.push('nsfw');
      Boolean(channel.isUnavailable) && chatProps.push('unavailable');

      Chat['vz-channel'] = chatProps.join(', ');

      const attributes = {
        'vz-search-results-active': this.props.section && this.props.section === 'SEARCH',
        'vz-message-editing-active': this.props.isEditing,
        'vz-voice-call-active': this.props.inCall,
        'vz-video-call-active': this.props.hasVideo,
        'vz-modal-active': this.props.hasModalOpen
      };

      const root = document.documentElement;
      const addAttributes = Object.keys(attributes).filter(m => attributes[m]);
      const removeAttributes = Object.keys(attributes).filter(m => !attributes[m]);
      addAttributes.forEach(attr => root.setAttribute(attr, ''));
      removeAttributes.forEach(attr => root.removeAttribute(attr));
    } catch (err) {
      return main.error(main._labels.concat(labels), err);
    }
  });

  setImmediate(() => instance.forceUpdate());

  return () => unpatch('vz-attributes-chat');
};
