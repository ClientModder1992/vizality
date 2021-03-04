import { getModule } from '@vizality/webpack';
import Discord from '@vizality/discord';

export const labels = [ 'Misc' ];

export default main => {
  try {
    const router = getModule('transitionTo');
    const root = document.documentElement;
    /**
     * Watch for route changes and set the new route on change
     */
    const unlisten = router?.getHistory()?.listen(async () => {
      const currentGuildId = getModule('getLastSelectedGuildId').getGuildId();
      const currentChannelId = getModule('getLastSelectedChannelId').getChannelId();
      const currentRoute = Discord.route.getCurrentRoute();
      root.setAttribute('vz-route', currentRoute);
      currentGuildId
        ? root.setAttribute('vz-guild-id', currentGuildId)
        : root.removeAttribute('vz-guild-id');
      currentChannelId
        ? root.setAttribute('vz-channel-id', currentChannelId)
        : root.removeAttribute('vz-channel-id');
    });
    return () => unlisten();
  } catch (err) {
    return main.error(main._labels.concat(labels.concat('Route')), err);
  }
};
