const { inject, uninject } = require('vizality/injector');
const { getModule } = require('vizality/webpack');
const { waitFor, joinClassNames, react: { forceUpdateElement, getOwnerInstance } } = require('vizality/util');

module.exports = async () => {
  const guildClasses = await getModule([ 'blobContainer' ], true);
  const guildElement = (await waitFor(`.${guildClasses.blobContainer.split(' ')[0]}`)).parentElement;
  const instance = getOwnerInstance(guildElement);

  inject('vz-utility-classes-guild', instance.__proto__, 'render', function (originalArgs, returnValue) {
    const { audio, badge: mentions, selected, unread, video, screenshare } = this.props;

    returnValue.props.className = joinClassNames(
      returnValue.props.className, {
        'vz-isUnread': unread,
        'vz-isSelected': selected,
        'vz-hasAudio': audio,
        'vz-hasVideo': video,
        'vz-hasScreenshare': screenshare,
        'vz-isMentioned': mentions > 0
      });

    returnValue.props['vz-guild-name'] = this.props.guild.name;
    returnValue.props['vz-guild-id'] = this.props.guildId;

    return returnValue;
  });

  setImmediate(() => forceUpdateElement(`.${guildElement.className.split(' ')[0]}`, true));
  return () => uninject('vz-utility-classes-guild');
};
