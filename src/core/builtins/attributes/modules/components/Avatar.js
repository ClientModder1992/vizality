import React from 'react';

import { forceUpdateElement } from '@vizality/util/react';
import { patch, unpatch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';

export default () => {
  const AvatarModule = getModule('AnimatedAvatar');
  const Avatar = AvatarModule.default;

  patch('vz-attributes-avatars', AvatarModule, 'default', (args, res) => {
    const avatar = args[0].src || void 0;
    if (avatar && avatar.includes('/avatars')) {
      [ , res.props['vz-user-id'] ] = avatar.match(/\/avatars\/(\d+)/);
    }

    return res;
  });

  // Re-render using patched component
  patch('vz-attributes-animated-avatars', AvatarModule.AnimatedAvatar, 'type', (_, res) => {
    return <Avatar {...res.props} />;
  });

  const classes = {
    avatars1: getModule('wrapper', 'avatar').wrapper.split(' ')[0],
    avatars2: getModule('avatar', 'timestamp', 'messageContent').avatar.split(' ')[0]
  };

  for (const avatar in classes) {
    setImmediate(() => forceUpdateElement(`.${avatar}`, true));
  }

  return () => {
    unpatch('vz-attributes-avatars');
    unpatch('vz-attributes-animated-avatars');
  };
};
