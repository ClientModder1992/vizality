const { getModule } = require('vizality/webpack');

module.exports = async () => {
  const Flux = getModule('Store', 'PersistedStore');
  Flux.connectStoresAsync = (stores, fn) => (Component) =>
    require('vizality/components').AsyncComponent.from((async () => {
      const awaitedStores = await Promise.all(stores);
      console.log('Remember to add these to settings (darkSiderbar, etc.)', awaitedStores);
      return Flux.connectStores(awaitedStores, (props) => fn(awaitedStores, props))(Component);
    })());
};
