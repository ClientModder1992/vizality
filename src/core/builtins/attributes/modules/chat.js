const { dom: { waitForElement }, react: { getOwnerInstance } } = require('@vizality/util');
const { patch, unpatch } = require('@vizality/patcher');
const { getModule } = require('@vizality/webpack');

// @test Set "this.props.isUnavailable" to true to test an unavailable channel

module.exports = async () => {
  const { chat } = getModule('chat');
  const instance = getOwnerInstance(await waitForElement(`.${chat.split(' ')[0]}`));

  patch('vz-attributes-chat', instance.__proto__, 'render', function (_, res) {
    if (!this.props?.channel) return res;

    const { channel } = this.props;

    res.props['vz-guild-channel'] = Boolean([ 0, 2, 4, 5, 6 ].includes(channel.type)) && '';
    res.props['vz-private-channel'] = Boolean([ 1, 3 ].includes(channel.type)) && '';
    res.props['vz-group-channel'] = Boolean([ 3 ].includes(channel.type)) && '';
    res.props['vz-text-channel'] = Boolean([ 0, 5 ].includes(channel.type)) && '';
    res.props['vz-voice-channel'] = Boolean([ 2 ].includes(channel.type)) && '';
    res.props['vz-news-channel'] = Boolean([ 5 ].includes(channel.type)) && '';
    res.props['vz-rules-channel'] = Boolean([ 0 ].includes(channel.type)) && '';
    res.props['vz-store-listing-channel'] = Boolean([ 6 ].includes(channel.type)) && '';
    res.props['vz-nsfw-channel'] = Boolean(channel.nsfw) && '';
    res.props['vz-unavailable-channel'] = Boolean(channel.isUnavailable) && '';

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
