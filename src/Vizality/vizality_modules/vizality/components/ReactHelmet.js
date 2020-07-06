const { getModule } = require('vizality/webpack');
const AsyncComponent = require('./AsyncComponent');

module.exports = {
  Helmet: AsyncComponent.from((async () => (await getModule([ 'HelmetProvider' ], true)).Helmet)()),
  HelmetProvider: AsyncComponent.from((async () => (await getModule([ 'HelmetProvider' ], true)).HelmetProvider)())
};
