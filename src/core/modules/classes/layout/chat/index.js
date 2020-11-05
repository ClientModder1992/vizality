const { object: { excludeProperties } } = require('@vizality/util');
const { getModule } = require('@vizality/webpack');

const attachments = require('./attachments');

module.exports = {
  ...getModule('pie'),
  ...getModule('poop'),
  textruler: getModule('emoji').textruler,
  alpha: getModule('emoji').textrudler,
  ...excludeProperties(getModule('chat'), 'chat'),
  iconActiveLarge: 'iconActiveLarge-2nzn9z',
  iconActiveMedium: 'iconActiveMedium-1UaEIR',
  iconActiveMini: 'iconActiveMini-3PzjMn',
  iconActiveSmall: 'iconActiveSmall-3IUUtn',
  iconActiveXLarge: 'iconActiveXLarge-_qKvKn',
  iconInactive: 'iconInactive-98JN5i',
  markup: 'markup-2BOw-j',
  attachments
};
