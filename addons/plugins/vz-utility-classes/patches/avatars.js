const { react: { forceUpdateElement } } = require('@util');
const { patch, unpatch } = require('@patcher');
const { React, getModule } = require('@webpack');

module.exports = async () => {
  const Avatar = await getModule('AnimatedAvatar', true);
  patch('vz-utility-classes-avatar', Avatar, 'default', (args, res) => {
    const avatar = args[0].src || void 0;
    if (avatar && avatar.includes('/avatars')) {
      [ , res.props['vz-user-id'] ] = avatar.match(/\/avatars\/(\d+)/);
    }

    return res;
  });

  // Re-render using patched component
  patch('vz-utility-classes-animated-avatar', Avatar.AnimatedAvatar, 'type', (_, res) =>
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
    unpatch('vz-utility-classes-avatar');
    unpatch('vz-utility-classes-animated-avatar');
  };
};
