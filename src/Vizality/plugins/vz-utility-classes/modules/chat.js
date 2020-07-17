/* eslint-disable no-unused-expressions */
const { inject, uninject } = require('vizality/injector');
const { getModule } = require('vizality/webpack');
const { joinClassNames, dom: { waitFor }, react: { getOwnerInstance } } = require('vizality/util');

module.exports = async () => {
  const { chat } = getModule('chat');
  const instance = getOwnerInstance(await waitFor(`.${chat.split(' ')[0]}`));

  inject('vz-utility-classes-chat', instance.__proto__, 'render', function (_, retValue) {
    if (!this || !this.props || !this.props.channel) return retValue;

    const { channel } = this.props;

    retValue.props.className = joinClassNames(
      retValue.props.className, {
        'vz-isGuildChannel': [ 0, 2, 4, 5, 6 ].includes(channel.type),
        'vz-isPrivateChannel': [ 1, 3 ].includes(channel.type),
        'vz-isGroupChannel': [ 3 ].includes(channel.type),
        'vz-isTextChannel': [ 0, 5 ].includes(channel.type),
        'vz-isVoiceChannel': [ 2 ].includes(channel.type),
        'vz-isNewsChannel': [ 5 ].includes(channel.type),
        'vz-isStoreListingChannel': [ 6 ].includes(channel.type),
        'vz-isNsfwChannel': channel.nsfw
      });

    const attributes = {
      'vz-search-results-active': this.props.section && this.props.section === 'SEARCH',
      'vz-message-editing-active': this.props.isEditing,
      'vz-voice-call-active': this.props.inCall,
      'vz-video-call-active': this.props.hasVideo,
      'vz-modal-active': this.props.hasModalOpen
    };

    const addAttributes = Object.keys(attributes).filter(m => attributes[m]);
    const removeAttributes = Object.keys(attributes).filter(m => !attributes[m]);

    addAttributes.forEach(attr => document.documentElement.setAttribute(attr, ''));
    removeAttributes.forEach(attr => document.documentElement.removeAttribute(attr));

    this.props.channelId
      ? document.documentElement.setAttribute('vz-channel-id', this.props.channelId)
      : document.documentElement.removeAttribute('vz-channel-id');

    this.props.guildId
      ? document.documentElement.setAttribute('vz-guild-id', this.props.guildId)
      : document.documentElement.removeAttribute('vz-guild-id');

    return retValue;
  });

  setImmediate(() => instance.forceUpdate());

  return () => uninject('vz-utility-classes-chat');
};

// @testing: Set this.props.isUnavailable to true to test an unavailable channel
