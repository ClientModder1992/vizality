const Webpack = require('@webpack');

const views = {
  ...Webpack.getModule('attachment'),
  ...Webpack.getModule('members')
};

module.exports = views;
