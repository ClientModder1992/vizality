const Webpack = require('@webpack');
const Util = require('@util');

const attachments = require('./attachments');

const chat = {
  ...Webpack.getModule('pie'),
  ...Webpack.getModule('poop'),
  textruler: Webpack.getModule('emoji').textruler,
  alpha: Webpack.getModule('emoji').textrudler,
  ...Util.Object.removeEntriesByKey(Webpack.getModule('chat'), 'chat'),
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
