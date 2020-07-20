const { getModuleByDisplayName } = require('@webpack');
const { inject, uninject } = require('@injector');
const { joinClassNames } = require('@util');

module.exports = () => {
  const PrivateChannel = getModuleByDisplayName('PrivateChannel');

  inject('vz-utility-classes-dmChannels', PrivateChannel.prototype, 'render', (_, res) => {
    const { props } = res;

    props['vz-user-name'] = props.name;
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

  return () => uninject('vz-utility-classes-dmChannels');
};
