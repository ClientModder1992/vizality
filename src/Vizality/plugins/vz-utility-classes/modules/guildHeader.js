/* eslint-disable no-unreachable */

const { inject, uninject } = require('vizality/injector');
const { getModule, getModuleByDisplayName } = require('vizality/webpack');
const { react: { forceUpdateElement } } = require('vizality/util');

/*
 * This module does nothing currently. It is just here for future reference in the event context
 * menu items need to be patched.
 */

module.exports = () => {
  return () => void 0;

  const GuildHeader = getModuleByDisplayName('GuildHeader');
  inject('vz-utility-classes-guildHeader', GuildHeader.prototype, 'renderHeader', (originalArgs, returnValue) => {
    return returnValue;
  });

  const className = getModule('iconBackgroundTierNone', 'container').header.split(' ')[0];
  setImmediate(() => forceUpdateElement(`.${className}`));
  return () => uninject('vz-utility-classes-guildHeader');
};
