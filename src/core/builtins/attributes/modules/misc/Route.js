import { getModule } from '@vizality/webpack';
import Discord from '@vizality/discord';

export const labels = [ 'Misc' ];

export default main => {
  try {
    const router = getModule('transitionTo');
    const root = document.documentElement;
    /**
     * Set the route initially on load
     */
    const currentRoute = Discord.route.getCurrentRoute();
    root.setAttribute('vz-route', currentRoute);

    /**
     * Watch for route changes and set the new route on change
     */
    const unlisten = router?.getHistory()?.listen(async () => {
      const currentRoute = Discord.route.getCurrentRoute();
      root.setAttribute('vz-route', currentRoute);
    });
    return () => unlisten();
  } catch (err) {
    return main.error(main._labels.concat(labels.concat('Route')), err);
  }
};
