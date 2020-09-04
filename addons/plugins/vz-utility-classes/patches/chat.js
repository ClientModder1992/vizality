const { joinClassNames, dom: { waitForElement }, react: { getOwnerInstance } } = require('@util');
const { patch, unpatch } = require('@patcher');
const { getModule } = require('@webpack');

// @test Set `this.props.isUnavailable` to true to test an unavailable channel

module.exports = async () => {
  const { chat } = getModule('chat');
  const instance = getOwnerInstance(await waitForElement(`.${chat.split(' ')[0]}`));

  patch('vz-utility-classes-chat', instance.__proto__, 'render', function (_, res) {
    if (!this || !this.props || !this.props.channel) return res;

    const { channel } = this.props;

    res.props.className = joinClassNames(
      res.props.className, {
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

    const root = document.documentElement;

    const addAttributes = Object.keys(attributes).filter(m => attributes[m]);
    const removeAttributes = Object.keys(attributes).filter(m => !attributes[m]);

    addAttributes.forEach(attr => root.setAttribute(attr, ''));
    removeAttributes.forEach(attr => root.removeAttribute(attr));

    this.props.channelId
      ? root.setAttribute('vz-channel-id', this.props.channelId)
      : root.removeAttribute('vz-channel-id');

    this.props.guildId
      ? root.setAttribute('vz-guild-id', this.props.guildId)
      : root.removeAttribute('vz-guild-id');

    return res;
  });

  setImmediate(() => instance.forceUpdate());

  return () => unpatch('vz-utility-classes-chat');
};
