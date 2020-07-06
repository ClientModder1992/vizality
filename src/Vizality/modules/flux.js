const { getModule } = require('vizality/webpack');

module.exports = async () => {
  const Flux = await getModule([ 'Store', 'PersistedStore' ], true);
  Flux.connectStoresAsync = (stores, fn) => (Component) =>
    require('vizality/components').AsyncComponent.from((async () => {
      const awaitedStores = await Promise.all(stores);
      console.log('Remember to add these to settings (darkSiderbar, etc.)', awaitedStores);
      return Flux.connectStores(awaitedStores, (props) => fn(awaitedStores, props))(Component);
    })());
};
