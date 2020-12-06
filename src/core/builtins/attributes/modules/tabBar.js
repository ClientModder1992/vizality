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

  patch('builtin-attributes-tabBar', TabBar.prototype, 'render', function (_, res) {
    if (!res.props || !res.props.children) return res;

    res.props['vz-item-selected'] = toKebabCase(this.props.selectedItem);

    return res;
  });

  patch('builtin-attributes-tabBar-items', TabBar.Item.prototype, 'render', function (_, res) {
    if (!res.props || !res.props.children) return res;

    res.props['vz-item-id'] = toKebabCase(this.props.id);

    return res;
  });

  return () => {
    unpatch('builtin-attributes-tabBar');
    unpatch('builtin-attributes-tabBar-items');
  };
};
