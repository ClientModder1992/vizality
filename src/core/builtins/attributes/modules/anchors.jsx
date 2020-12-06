const { patch, unpatch } = require('@vizality/patcher');
const { getModule } = require('@vizality/webpack');

module.exports = async () => {
  const Anchor = getModule(m => m.default && m.default.displayName === 'Anchor');

  patch('vz-attributes-anchors', Anchor, 'default', (_, res) => {
    if (!res.props || !res.props.href) return res;

    // Make Vizality routes open in the app
    if (new RegExp(/https?:\/\/(?:[a-z]+\.)?discord(?:app)?\.com\/vizality/i).test(res.props.href)) {
      const route = res.props.href.replace(/https?:\/\/(?:[a-z]+\.)?discord(?:app)?\.com\/vizality/i, '');
      res.props.onClick = e => {
        e.preventDefault();
        vizality.api.router.navigate(route);
      };
    }

    // Make Vizality protocol links open in the app
    if (new RegExp(/vizality:\/\//i).test(res.props.href)) {
      const route = res.props.href.replace(/vizality:\/\//i, '');
      res.props.onClick = e => {
        e.preventDefault();
        vizality.api.router.navigate(`/dashboard/${route}`);
      };
    }

    // Make user links open in user profile modals in the app
    if (new RegExp(/https?:\/\/(?:[a-z]+\.)?discord(?:app)?\.com\/users\//i).test(res.props.href)) {
      const userId = res.props.href.replace(/https?:\/\/(?:[a-z]+\.)?discord(?:app)?\.com\/users\//i, '');
      res.props.onClick = e => {
        e.preventDefault();
        // @todo This doesn't work, fix it.
        Promise.all(() => getModule('open', 'fetchProfile').open(userId))
          .catch(() => vizality.api.notices.sendToast(`some-random-${(Math.random().toString(36) + Date.now()).substring(2, 6)}`, {
            header: 'User Not Found',
            content: `We were unable to locate that user.`,
            type: 'error'
          }));
      };
    }

    return res;
  });

  return () => unpatch('vz-attributes-anchors');
};
