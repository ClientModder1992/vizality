const { getModule } = require('vizality/webpack');
const currentWebContents = require('electron').remote.getCurrentWebContents();

module.exports = {
  routes: {
    discover: getModule([ 'Routes' ], false).Routes.GUILD_DISCOVERY,
    // channel: '//channels/[0-9]+/.*/',
    dm: '/channels/@me/',
    friends: getModule([ 'Routes' ], false).Routes.FRIENDS,
    guild: '/channels/',
    library: getModule([ 'Routes' ], false).Routes.APPLICATION_LIBRARY,
    nitro: getModule([ 'Routes' ], false).Routes.APPLICATION_STORE
  },

  to: async (location) => {
    if (location === 'discover') return (await getModule([ 'transitionTo' ])).transitionTo((await getModule([ 'Routes' ])).Routes.GUILD_DISCOVERY);
    if (location === 'dm') {
      return (await getModule([ 'transitionTo' ])).transitionTo(
        (await getModule([ 'Routes' ])).Routes.CHANNEL('@me', (await getModule([ 'getPrivateChannelIds' ])).getPrivateChannelIds()[0])
      );
    }
    if (location === 'friends') return getModule([ 'transitionTo' ], false).transitionTo((await getModule([ 'Routes' ])).Routes.FRIENDS);
    if (location === 'library') return (await getModule([ 'transitionTo' ])).transitionTo((await getModule([ 'Routes' ])).Routes.APPLICATION_LIBRARY);
    if (location === 'nitro') return (await getModule([ 'transitionTo' ])).transitionTo((await getModule([ 'Routes' ])).Routes.APPLICATION_STORE);

    console.warn(`${location} not found.`);
  },

  get currentRoute () {
    const { routes } = this;
    const historyRoute = currentWebContents.history[currentWebContents.history.length - 2];
    for (let location in routes) {
      if (window.location.href.includes(routes[location])) {
        let locationStr = window.location.href.split('/');
        locationStr = `/${locationStr[3]}/${locationStr[4]}/`;

        if (location === 'guild' && historyRoute.includes(locationStr)) {
          location = 'channel';
        }
        return location;
      }
    }
    return 'unknown';
  }
};
