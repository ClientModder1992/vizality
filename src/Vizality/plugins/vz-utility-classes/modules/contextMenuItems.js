/* eslint-disable no-unused-vars */
const { inject, uninject } = require('@injector');
const { React, getModule } = require('@webpack');
const { joinClassNames } = require('@util');

/*
 * This module does nothing currently. It is just here for future reference in the event context
 * menu items need to be patched.
 */

module.exports = () => {
  return () => void 0;

  /* eslint-disable no-unreachable */
  const MenuItem = getModule(m => m.default && m.default.displayName === 'MenuItem');

  inject('vz-utility-classes-contextMenuItems', MenuItem, 'default', ([ props ], returnValue) => {
    return returnValue;
  });

  return () => uninject('vz-utility-classes-contextMenuItems');
};
