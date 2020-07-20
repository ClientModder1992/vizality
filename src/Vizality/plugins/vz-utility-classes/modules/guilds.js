const { joinClassNames, dom: { waitForElement }, react: { forceUpdateElement, getOwnerInstance } } = require('@util');
const { inject, uninject } = require('@injector');
const { getModule } = require('@webpack');

module.exports = async () => {
  const guildClasses = getModule('blobContainer');
  const guildElement = (await waitForElement(`.${guildClasses.blobContainer.split(' ')[0]}`)).parentElement;
  const instance = getOwnerInstance(guildElement);

  inject('vz-utility-classes-guild', instance.__proto__, 'render', function (_, res) {
    // Guilds with outages
    if (!this || !this.props) return;

    const { audio, badge: mentions, selected, unread, video, screenshare } = this.props;

    res.props.className = joinClassNames(
      res.props.className, {
        'vz-isUnread': unread,
        'vz-isSelected': selected,
        'vz-hasAudio': audio,
        'vz-hasVideo': video,
        'vz-hasScreenshare': screenshare,
        'vz-isMentioned': mentions > 0
      });

    res.props['vz-guild-name'] = this.props.guild.name;
    res.props['vz-guild-id'] = this.props.guildId;

    return res;
  });

  setImmediate(() => forceUpdateElement(`.${guildElement.className.split(' ')[0]}`, true));
  return () => uninject('vz-utility-classes-guild');
};
