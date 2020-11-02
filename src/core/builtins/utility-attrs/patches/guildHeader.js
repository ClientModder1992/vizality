/* eslint-disable no-unreachable */
const { getModule, getModuleByDisplayName } = require('@webpack');
const { react: { forceUpdateElement } } = require('@util');
const { patch, unpatch } = require('@patcher');

/*
 * @note This module does nothing currently. It is just here for future reference in the event the
 * guild header item needs to be patched.
 */

module.exports = () => {
  return () => void 0;

  const GuildHeader = getModuleByDisplayName('GuildHeader');
  patch('vz-utility-attrs-guildHeader', GuildHeader.prototype, 'renderHeader', (_, res) => {
    return res;
  });

  const className = getModule('iconBackgroundTierNone', 'container').header.split(' ')[0];
  setImmediate(() => forceUpdateElement(`.${className}`));
  return () => unpatch('vz-utility-attrs-guildHeader');
};
