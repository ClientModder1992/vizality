/* eslint-disable no-unused-vars */

const { getModule } = require('vizality/webpack');
const { logger } = require('vizality/util');

const currentWebContents = require('electron').remote.getCurrentWebContents();

const navigate = () => {
  const MODULE = 'Navigate';
  const SUBMODULE = 'Route:goTo';

  const ROUTES = {
    discover: getModule([ 'Routes' ], false).Routes.GUILD_DISCOVERY,
    // channel: '//channels/[0-9]+/.*/',
    dm: '/channels/@me/',
    friends: getModule([ 'Routes' ], false).Routes.FRIENDS,
    guild: '/channels/',
    library: getModule([ 'Routes' ], false).Routes.APPLICATION_LIBRARY,
    nitro: getModule([ 'Routes' ], false).Routes.APPLICATION_STORE
  };

  async function goTo (location) {
    if (location === 'discover') return (await getModule([ 'transitionTo' ])).transitionTo((await getModule([ 'Routes' ])).Routes.GUILD_DISCOVERY);
    if (location === 'dm') {
      return (await getModule([ 'transitionTo' ])).transitionTo(
        (await getModule([ 'Routes' ])).Routes.CHANNEL('@me', (await getModule([ 'getPrivateChannelIds' ])).getPrivateChannelIds()[0])
      );
    }
    if (location === 'friends') return getModule([ 'transitionTo' ], false).transitionTo((await getModule([ 'Routes' ])).Routes.FRIENDS);
    if (location === 'library') return (await getModule([ 'transitionTo' ])).transitionTo((await getModule([ 'Routes' ])).Routes.APPLICATION_LIBRARY);
    if (location === 'nitro') return (await getModule([ 'transitionTo' ])).transitionTo((await getModule([ 'Routes' ])).Routes.APPLICATION_STORE);

    return logger.warn(MODULE, SUBMODULE, null, `The route '${location}' was not found.`);
  }

  function currentRoute () {
    const historyRoute = currentWebContents.history[currentWebContents.history.length - 2];
    for (let location in ROUTES) {
      if (window.location.href.includes(ROUTES[location])) {
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

module.exports = navigate;
