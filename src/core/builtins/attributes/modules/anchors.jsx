const { patch, unpatch } = require('@vizality/patcher');
const { getModule } = require('@vizality/webpack');
const { Regexes } = require('@vizality/constants');

module.exports = async () => {
  const Anchor = getModule(m => m.default?.displayName === 'Anchor');
  const discordRegex = new RegExp(`${Regexes.DISCORD}`, 'i');
  const vizalityRegex = new RegExp(`${Regexes.DISCORD}/vizality`, 'i');
  const vizalityProtocolRegex = new RegExp(/vizality:\/\//i);
  const userRegex = new RegExp(`${Regexes.DISCORD}/users/`, 'i');

  patch('vz-attributes-anchors', Anchor, 'default', (_, res) => {
    if (!res?.props?.href) return res;

    // Make Vizality routes open in the app
    if (vizalityRegex.test(res.props?.href)) {
      const route = res.props?.href.replace(discordRegex, '');
      res.props.onClick = e => {
        e.preventDefault();
        vizality.api.router.navigate(route);
      };
    }

    // Make Vizality protocol links open in the app
    if (vizalityProtocolRegex.test(res.props?.href)) {
      const route = res.props?.href.replace(vizalityProtocolRegex, '');
      res.props.onClick = e => {
        e.preventDefault();
        vizality.api.router.navigate(`/vizality/dashboard/${route}`);
      };
    }

    // Make user links open in user profile modals in the app
    if (userRegex.test(res.props?.href)) {
      const userId = res.props?.href.replace(userRegex, '');
      res.props.onClick = e => {
        e.preventDefault();
        // @todo Use Discord module for this after it's set up.
        getModule('getUser').getUser(userId)
          .then(() => getModule('open', 'fetchProfile').open(userId))
          .catch(() => vizality.api.notices.sendToast(`open-user-profile-random-${(Math.random().toString(36) + Date.now()).substring(2, 6)}`, {
            header: 'User Not Found',
            type: 'User Not Found',
            content: 'That user was unable to be located.',
            icon: 'PersonRemove'
          }));
      };
    }

    return res;
  });

  return () => unpatch('vz-attributes-anchors');
};
