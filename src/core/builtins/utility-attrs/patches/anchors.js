const { patch, unpatch } = require('@vizality/patcher');
const { getModule } = require('@vizality/webpack');

module.exports = async () => {
  const Anchor = getModule(m => m.default && m.default.displayName === 'Anchor');
  patch('vz-utility-attrs-anchors', Anchor, 'default', (_, res) => {
    if (!res.props || !res.props.href) return res;

    // Make Vizality routes open in the app
    if (new RegExp(/https?:\/\/(?:[a-z]+\.)?discord(?:app)?\.com\/vizality/i).test(res.props.href)) {
      const route = res.props.href.replace(/https?:\/\/(?:[a-z]+\.)?discord(?:app)?\.com\/vizality/i, '');
      res.props.onClick = (e) => {
        e.preventDefault();
        vizality.api.router.navigate(route);
      };
    }

    // Make user links open in user profile modals in the app
    if (new RegExp(/https?:\/\/(?:[a-z]+\.)?discord(?:app)?\.com\/users\//i).test(res.props.href)) {
      const userId = res.props.href.replace(/https?:\/\/(?:[a-z]+\.)?discord(?:app)?\.com\/users\//i, '');
      res.props.onClick = async (e) => {
        e.preventDefault();
        // @todo: Maybe have the catch return an error modal or something instead.
        try {
          getModule('open', 'fetchProfile').open(userId);
        } catch (err) {
          // Fail silently
        }
      };
    }

    return res;
  });

  return () => unpatch('vz-utility-attrs-anchors');
};
