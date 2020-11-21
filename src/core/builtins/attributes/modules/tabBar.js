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

  patch('vz-attributes-tabBar', TabBar.prototype, 'render', function (_, res) {
    if (!res.props || !res.props.children) return res;

    res.props['vz-item-selected'] = toKebabCase(this.props.selectedItem);

    const tabBarItems = res.props.children;

    for (const item of tabBarItems) {
      if (!item || !item.props || !item.props.id) continue;

      /*
       * @todo It adds the prop, which you can see in RDT,
       * but the DOM doesn't update. forceUpdateElement doesn't
       * seem to help/.
       */
      item.props['vz-item'] = toKebabCase(item.props.id);
    }

    return res;
  });

  return () => unpatch('vz-attributes-tabBar');
};
