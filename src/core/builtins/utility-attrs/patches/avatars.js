const { react: { forceUpdateElement } } = require('@util');
const { patch, unpatch } = require('@patcher');
const { getModule } = require('@webpack');
const { React } = require('@react');

module.exports = async () => {
  const Avatar = await getModule('AnimatedAvatar', true);
  patch('vz-utility-attrs-avatar', Avatar, 'default', (args, res) => {
    const avatar = args[0].src || void 0;
    if (avatar && avatar.includes('/avatars')) {
      [ , res.props['vz-user-id'] ] = avatar.match(/\/avatars\/(\d+)/);
    }

    return res;
  });

  // Re-render using patched component
  patch('vz-utility-attrs-animated-avatar', Avatar.AnimatedAvatar, 'type', (_, res) =>
    React.createElement(Avatar.default, { ...res.props }));

  Avatar.default.Sizes = Avatar.Sizes;

  const classes = {
    className: getModule('wrapper', 'avatar').wrapper.split(' ')[0],
    className2: getModule('avatar', 'timestamp', 'messageContent').avatar.split(' ')[0]
  };

  for (const cl in classes) {
    setImmediate(() => forceUpdateElement(`.${cl}`));
  }

  return () => {
    unpatch('vz-utility-attrs-avatar');
    unpatch('vz-utility-attrs-animated-avatar');
  };
};
