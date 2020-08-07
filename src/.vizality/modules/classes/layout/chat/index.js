const { object: { removeProperties } } = require('@utilities');
const { getModule } = require('@webpack');

const attachments = require('./attachments');

const chat = {
  ...getModule('pie'),
  ...getModule('poop'),
  textruler: getModule('emoji').textruler,
  alpha: getModule('emoji').textrudler,
  ...removeProperties(getModule('chat'), 'chat'),
  iconActiveLarge: 'iconActiveLarge-2nzn9z',
  iconActiveMedium: 'iconActiveMedium-1UaEIR',
  iconActiveMini: 'iconActiveMini-3PzjMn',
  iconActiveSmall: 'iconActiveSmall-3IUUtn',
  iconActiveXLarge: 'iconActiveXLarge-_qKvKn',
  iconInactive: 'iconInactive-98JN5i',
  markup: 'markup-2BOw-j',
  attachments
};

module.exports = chat;
