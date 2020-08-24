const Webpack = require('@webpack');

const AsyncComponent = require('./AsyncComponent');

module.exports = {
  Helmet: AsyncComponent.from((async () => (await Webpack.getModule('HelmetProvider', true)).Helmet)()),
  HelmetProvider: AsyncComponent.from((async () => (await Webpack.getModule('HelmetProvider', true)).HelmetProvider)())
};
