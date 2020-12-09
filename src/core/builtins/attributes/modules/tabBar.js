const { getModuleByDisplayName } = require('@vizality/webpack');
const { string: { toKebabCase } } = require('@vizality/util');
const { patch, unpatch } = require('@vizality/patcher');

/*
 * Modifies The TabBar component, which is used in various places throughout
 * Discord (settings sidebar, friends list tabs, user profile tabs). This adds
 * classes to those items to make them more easy / consistent to target.
 */
module.exports = async () => {
  const TabBar = getModuleByDisplayName('TabBar');

  patch('vz-attributes-tab-bar', TabBar.prototype, 'render', function (_, res) {
    if (!res.props?.children) return res;

    res.props['vz-item-selected'] = toKebabCase(this.props?.selectedItem);

    return res;
  });

  patch('vz-attributes-tab-bar-items', TabBar.Item?.prototype, 'render', function (_, res) {
    if (!res.props?.children) return res;

    res.props['vz-item'] = toKebabCase(this.props?.id);

    return res;
  });

  return () => {
    unpatch('vz-attributes-tab-bar');
    unpatch('vz-attributes-tab-bar-items');
  };
};
