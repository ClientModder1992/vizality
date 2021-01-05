// const { joinClassNames, dom: { waitForElement }, react: { forceUpdateElement, getOwnerInstance }, string: { toCamelCase } } = require('@vizality/util');
// const { patch, unpatch } = require('@vizality/patcher');
// const { getModule } = require('@vizality/webpack');
// const { Messages } = require('@vizality/i18n');

module.exports = async () => { void 0;
  // const channelHeaderButtonClasses = await getModule('iconWrapper', 'toolbar', true);
  // const instance = getOwnerInstance(await waitForElement(`.${channelHeaderButtonClasses.iconWrapper}`));

  // if (!instance) return;

  // patch('vz-attributes-channelHeaderButtons', instance.__proto__, 'render', (_, res) => {
  //   if (!res.props?.className ||
  //       !res.props?.className?.split(' ')?.includes(channelHeaderButtonClasses.iconWrapper) ||
  //       !res.props['aria-label']) {
  //     return res;
  //   }

  //   console.log(res);

  //   const ariaLabel = res.props['aria-label'];

  //   let key = Object.keys(Messages).find(key => ariaLabel === Messages[key]);

  //   if (!key) {
  //     const SelectedChannelId = getModule('getChannelId', 'getVoiceChannelId').getChannelId();
  //     const ChannelStore = getModule('getChannel').getChannel(SelectedChannelId);
  //     if (ChannelStore && ChannelStore.name) {
  //       if (ariaLabel === Messages.CHANNEL_MUTE_LABEL.format({ channelName: ChannelStore.name })) {
  //         key = 'CHANNEL_MUTE';
  //       }
  //     }
  //   }

  //   switch (key) {
  //     case 'CREATE_DM':
  //     case 'GROUP_DM_ADD_FRIENDS':
  //     case 'HELP':
  //     case 'INBOX':
  //     case 'MEMBER_LIST':
  //     case 'NEW_GROUP_DM':
  //     case 'START_VIDEO_CALL':
  //     case 'START_VOICE_CALL':
  //       res.props.className = joinClassNames(res.props.className, `vz-${toCamelCase(key)}Button`);
  //       break;
  //     case 'CHANNEL_MUTE':
  //       res.props.className = joinClassNames(res.props.className,
  //         {
  //           'vz-channelUnmuteButton': res.props['aria-checked'],
  //           'vz-channelMuteButton': !res.props['aria-checked']
  //         }
  //       );
  //       break;
  //     case 'PINNED_MESSAGES':
  //       res.props.className = joinClassNames(
  //         res.props.className, `vz-${toCamelCase(key)}Button`, { 'vz-isUnread': res.props.children[1] }
  //       );
  //       break;
  //   }

  //   return res;
  // });

  // setImmediate(() => forceUpdateElement(`.${channelHeaderButtonClasses.iconWrapper}`, true));

  // return () => unpatch('vz-attributes-channelHeaderButtons');
};
