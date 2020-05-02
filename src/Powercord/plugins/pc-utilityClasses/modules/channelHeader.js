const { getModuleByDisplayName } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');

module.exports = async () => {
  const ChannelHeader = await getModuleByDisplayName('HeaderBarContainer');
  inject('pc-utilitycls-channelHeader', ChannelHeader.prototype, 'render', function (_, res) {
    if (this.props.channelId) {
      document.documentElement.dataset.channelId = this.props.channelId;
    } else {
      delete document.documentElement.dataset.channelId;
    }
    if (this.props.guildId) {
      document.documentElement.dataset.guildId = this.props.guildId;
    } else {
      delete document.documentElement.dataset.guildId;
    }
    return res;
  });

  return async () => uninject('pc-utilitycls-channelHeader');
};
