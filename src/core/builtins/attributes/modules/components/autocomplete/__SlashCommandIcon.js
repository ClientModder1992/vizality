const { react: { forceUpdateElement, findInReactTree } } = require('@vizality/util');
const { patch, unpatch } = require('@vizality/patcher');
const { getModule } = require('@vizality/webpack');
const { React } = require('@vizality/react');

module.exports = () => {
  const ApplicationCommandDiscoveryApplicationIcon = getModule(m => m.default?.displayName === 'ApplicationCommandDiscoveryApplicationIcon');
  const { mask, icon } = getModule('mask', 'icon');

  patch('vz-attributes-sacvx', ApplicationCommandDiscoveryApplicationIcon, 'default', (args, res) => {
    let { src } = findInReactTree(res, r => r.src);

    if (src.includes('vz-plugin://') || src.includes('https://cdn.vizality.com/assets/logo.png')) {
      src = src.split('.webp');
      if (new RegExp(`https://cdn.discordapp.com/app-icons/(.*)/`).test(src[0])) {
        res.props.children.props.children.props.src = src[0].replace(new RegExp(`https://cdn.discordapp.com/app-icons/([^/]+)/`, 'ig'), '');
        console.log(res.props.children.props.children.props.src);
      }
    }

    return res;
  });

  // setImmediate(() => forceUpdateElement(`.${mask}`));
  // setImmediate(() => forceUpdateElement(`.${icon}`));

  return () => unpatch('vz-attributes-sacvx');
};
