const { getModuleByDisplayName } = require('@vizality/webpack');
const { patch, unpatch } = require('@vizality/patcher');
const { joinClassNames } = require('@vizality/util');

module.exports = async () => {
  const PrivateChannel = await getModuleByDisplayName('PrivateChannel', true);

  patch('vz-utility-attrs-dmChannels', PrivateChannel.prototype, 'render', (_, res) => {
    const { props } = res;

    props['vz-user-name'] = props.name.props.children;
    /*
     * @todo: Figure out how to:
     * vz-user-id
     * vz-isBotUser
     * vz-isGroupDm
     * vz-isUser
     */

    props.className = joinClassNames(
      props.className, {
        'vz-isMuted': props.muted,
        'vz-dmChannel': props.name,
        'vz-hasActivity': props.subText && props.subText.props && props.subText.props.activities && props.subText.props.activities.length
      });

    return res;
  });

  return () => unpatch('vz-utility-attrs-dmChannels');
};
