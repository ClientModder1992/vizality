const { inject, uninject } = require('vizality/injector');
const { getModule, i18n: { Messages } } = require('vizality/webpack');
const { joinClassNames, dom: { waitFor }, react: { forceUpdateElement, getOwnerInstance }, string: { toCamelCase } } = require('vizality/util');

module.exports = async () => {
  const channelHeaderButtonClasses = getModule('iconWrapper', 'toolbar');
  const instance = getOwnerInstance(await waitFor(`.${channelHeaderButtonClasses.iconWrapper}`));

  if (!instance) return;

  inject('vz-utility-classes-channelHeaderButtons', instance.__proto__, 'render', (originalArgs, returnValue) => {
    if (!returnValue.props.className ||
        !returnValue.props.className.split(' ').includes(channelHeaderButtonClasses.iconWrapper) ||
        !returnValue.props['aria-label']) {
      return returnValue;
    }

    const ariaLabel = returnValue.props['aria-label'];

    let key = Object.keys(Messages).find(key => ariaLabel === Messages[key]);

    if (!key) {
      const SelectedChannelId = getModule('getChannelId').getChannelId();
      const ChannelStore = getModule('getChannel').getChannel(SelectedChannelId);
      if (ariaLabel === Messages.CHANNEL_MUTE_LABEL.format({ channelName: ChannelStore.name })) {
        key = 'CHANNEL_MUTE';
      }
    }

    switch (key) {
      case 'CREATE_DM':
      case 'GROUP_DM_ADD_FRIENDS':
      case 'HELP':
      case 'INBOX':
      case 'MEMBER_LIST':
      case 'NEW_GROUP_DM':
      case 'START_VIDEO_CALL':
      case 'START_VOICE_CALL':
        returnValue.props.className = joinClassNames(returnValue.props.className, `vz-${toCamelCase(key)}Button`);
        break;
      case 'CHANNEL_MUTE':
        returnValue.props.className = joinClassNames(returnValue.props.className,
          {
            'vz-channelUnmuteButton': returnValue.props['aria-checked'],
            'vz-channelMuteButton': !returnValue.props['aria-checked']
          }
        );
        break;
      case 'PINNED_MESSAGES':
        returnValue.props.className = joinClassNames(
          returnValue.props.className, `vz-${toCamelCase(key)}Button`, { 'vz-isUnread': returnValue.props.children[1] }
        );
        break;
    }

    return returnValue;
  });

  setImmediate(() => forceUpdateElement(`.${channelHeaderButtonClasses.iconWrapper}`, true));

  return () => uninject('vz-utility-classes-channelHeaderButtons');
};
