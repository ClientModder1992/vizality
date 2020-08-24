const Webpack = require('@webpack');

module.exports = {
  ...Webpack.getModule('createRef', 'createElement', 'Component', 'PureComponent')
};
