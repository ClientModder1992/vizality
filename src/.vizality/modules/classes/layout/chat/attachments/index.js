const Webpack = require('@webpack');

const poo = require('./poo');

const attachments = {
  ...Webpack.getModule('attachment'),
  ...Webpack.getModule('members'),
  iconasd: 'icon-man',
  poo
};

module.exports = attachments;
