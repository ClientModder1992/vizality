const Webpack = require('@webpack');

module.exports = {
  ...Webpack.getModule('Messages', 'languages').Messages
};
