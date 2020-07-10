const { getModule } = require('vizality/webpack');
const { object: { removeProperties } } = require('vizality/util');
const attachments = require('./attachments');

const chat = {
  ...getModule('pie'),
  ...getModule('poop'),
  ...removeProperties(getModule('chat'), 'chat'),
  iconActiveLarge: 'iconActiveLarge-2nzn9z',
  iconActiveMedium: 'iconActiveMedium-1UaEIR',
  iconActiveMini: 'iconActiveMini-3PzjMn',
  iconActiveSmall: 'iconActiveSmall-3IUUtn',
  iconActiveXLarge: 'iconActiveXLarge-_qKvKn',
  iconInactive: 'iconInactive-98JN5i',
  attachments
};

module.exports = chat;
