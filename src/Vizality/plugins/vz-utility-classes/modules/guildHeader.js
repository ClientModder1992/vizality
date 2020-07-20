/* eslint-disable no-unreachable */

const { getModule, getModuleByDisplayName } = require('@webpack');
const { react: { forceUpdateElement } } = require('@util');
const { inject, uninject } = require('@injector');

/*
 * This module does nothing currently. It is just here for future reference in the event the
 * guild header item needs to be patched.
 */

module.exports = () => {
  return () => void 0;

  const GuildHeader = getModuleByDisplayName('GuildHeader');
  inject('vz-utility-classes-guildHeader', GuildHeader.prototype, 'renderHeader', (_, res) => {
    return res;
  });

  const className = getModule('iconBackgroundTierNone', 'container').header.split(' ')[0];
  setImmediate(() => forceUpdateElement(`.${className}`));
  return () => uninject('vz-utility-classes-guildHeader');
};
