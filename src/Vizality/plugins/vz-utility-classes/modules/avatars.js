const { inject, uninject } = require('vizality/injector');
const { React, getModule } = require('vizality/webpack');
const { forceUpdateElement } = require('vizality/util');

module.exports = async () => {
  const Avatar = await getModule([ 'AnimatedAvatar' ]);

  inject('vz-utility-classes-avatar', Avatar, 'default', (originalArgs, returnValue) => {
    const avatar = originalArgs[0].src || void 0;
    if (avatar && avatar.includes('/avatars')) {
      [ , returnValue.props['vz-user-id'] ] = avatar.match(/\/avatars\/(\d+)/);
    }

    return returnValue;
  });

  // Re-render using patched component
  inject('vz-utility-classes-animated-avatar', Avatar.AnimatedAvatar, 'type', (originalArgs, returnValue) =>
    React.createElement(Avatar.default, { ...returnValue.props }));

  Avatar.default.Sizes = Avatar.Sizes;

  const className = (await getModule([ 'wrapper', 'avatar' ])).wrapper.split(' ')[0];
  setImmediate(() => forceUpdateElement(`.${className}`));
  return () => {
    uninject('vz-utility-classes-avatar');
    uninject('vz-utility-classes-animated-avatar');
  };
};
