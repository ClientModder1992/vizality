const Webpack = require('@webpack');

module.exports = {
  ...Webpack.getModule('render', 'createPortal')
};
