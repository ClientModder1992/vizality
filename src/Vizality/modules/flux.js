const { getModule } = require('vizality/webpack');

module.exports = async () => {
  const Flux = await getModule([ 'Store', 'PersistedStore' ]);
  Flux.connectStoresAsync = (stores, fn) => (Component) =>
    require('vizality/components').AsyncComponent.from((async () => {
      const awaitedStores = await Promise.all(stores);
      return Flux.connectStores(awaitedStores, (props) => fn(awaitedStores, props))(Component);
    })());
};
