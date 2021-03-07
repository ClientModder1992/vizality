import Webpack from '@vizality/webpack';

export const labels = [ 'Misc' ];

export default main => {
  try {
    const routeListener = Webpack.getModule('listeners', 'flushRoute');
    const root = document.documentElement;
    /**
     * Watch for route changes and set the new route on change
     */
    const handleRouteChange = () => {
      const currentGuildId = Webpack.getModule('getLastSelectedGuildId')?.getGuildId();
      const currentChannelId = Webpack.getModule('getLastSelectedChannelId')?.getChannelId();
      const currentRoute = vizality.api.routes.getCurrentRoute();
      root.setAttribute('vz-route', currentRoute?.name);
      currentGuildId
        ? root.setAttribute('vz-guild-id', currentGuildId)
        : root.removeAttribute('vz-guild-id');
      currentChannelId
        ? root.setAttribute('vz-channel-id', currentChannelId)
        : root.removeAttribute('vz-channel-id');
    };
    routeListener?.listeners?.add(handleRouteChange);
    return () => {
      root.removeAttribute('vz-route')
      root.removeAttribute('vz-guild-id')
      root.removeAttribute('vz-channel-id');
      routeListener?.listeners?.delete(handleRouteChange);
    };
  } catch (err) {
    return main.error(main._labels.concat(labels.concat('Route')), err);
  }
};
