/* eslint-disable no-unused-vars */
const { React, getModule } = require('@webpack');
const { joinClassNames } = require('@util');
const { patch, unpatch } = require('@patcher');

/*
 * This module does nothing currently. It is just here for future reference in the event context
 * menu items need to be patched.
 */

module.exports = () => {
  return () => void 0;

  /* eslint-disable no-unreachable */
  const MenuItem = getModule(m => m.default && m.default.displayName === 'MenuItem');

  patch('vz-utility-classes-contextMenuItems', MenuItem, 'default', ([ props ], res) => {
    return res;
  });

  return () => unpatch('vz-utility-classes-contextMenuItems');
};
