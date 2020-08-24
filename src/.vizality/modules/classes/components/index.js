const Webpack = require('@webpack');

const components = {
  ...Webpack.getModule('attachment'),
  ...Webpack.getModule('members'),
  hunk: Webpack.getModule('members').hunk
};

module.exports = components;
