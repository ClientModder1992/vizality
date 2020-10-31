const { react: { forceUpdateElement } } = require('@util');
const { patch, unpatch } = require('@patcher');
const { getModule } = require('@webpack');

module.exports = () => {
  const Anchor = getModule(m => m.default && m.default.displayName === 'Anchor');
  patch('vz-utility-classes-anchors', Anchor, 'default', (args, res) => {
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
      res.props.onClick = (e) => {
        e.preventDefault();
        getModule('open', 'fetchProfile').open(userId).catch(err => err.body.message);
      };
    }

    return res;
  });

  return () => unpatch('vz-utility-classes-anchors');
};
