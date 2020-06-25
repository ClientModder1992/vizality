const { inject, uninject } = require('vizality/injector');
const { getModuleByDisplayName } = require('vizality/webpack');
const { classNames } = require('vizality/util');

module.exports = async () => {
  const PrivateChannel = await getModuleByDisplayName('PrivateChannel');

  inject('vz-utility-classes-dmChannels', PrivateChannel.prototype, 'render', (originalArgs, returnValue) => {
    const { props } = returnValue;

    props['vz-user-name'] = props.name;
    /*
     * vz-user-id
     * vz-isBotUser
     * vz-isGroupDm
     * vz-isUser
     */

    props.className = classNames(
      props.className, {
        'vz-isMuted': props.muted,
        'vz-dmChannel': props.name,
        'vz-hasActivity': props.subText && props.subText.props && props.subText.props.activities && props.subText.props.activities.length
      });

    return returnValue;
  });

  return () => uninject('vz-utility-classes-dmChannels');
};
