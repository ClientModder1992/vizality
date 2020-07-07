/* eslint-disable no-unused-vars */
const { inject, uninject } = require('vizality/injector');
const { React, getModule } = require('vizality/webpack');
const { joinClassNames } = require('vizality/util');

/*
 * This module does nothing currently. It is just here for future reference in the event context
 * menu items need to be patched.
 */

module.exports = () => {
  return () => void 0;

  /* eslint-disable no-unreachable */
  const MenuItem = getModule(m => m.default && m.default.displayName === 'MenuItem');
  const originalMenuItem = MenuItem.default;
  const GuildStore = getModule('getGuild');

  inject('vz-utility-classes-contextMenuItems', MenuItem, 'default', ([ props ], returnValue) => {
    return returnValue;
  });

  Object.assign(MenuItem.default, originalMenuItem);

  return () => uninject('vz-utility-classes-contextMenuItems');
};
