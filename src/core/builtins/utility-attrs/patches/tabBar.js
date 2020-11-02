const { joinClassNames, string: { toCamelCase } } = require('@util');
const { getModuleByDisplayName } = require('@webpack');
const { patch, unpatch } = require('@patcher');

/*
 * Modifies The TabBar component, which is used in various places throughout
 * Discord (settings sidebar, friends list tabs, user profile tabs). This adds
 * classes to those items to make them more easy / consistent to target.
 */

module.exports = async () => {
  const TabBar = getModuleByDisplayName('TabBar');

  patch('vz-utility-attrs-tabBar', TabBar.prototype, 'render', function (_, res) {
    if (!res.props || !res.props.children) return res;

    /*
     * We check if the item starts with vz- particularly for settings sidebar items
     * for core plugins.
     */
    const selected = toCamelCase(this.props.selectedItem.startsWith('vz-') ? this.props.selectedItem.replace('vz-', '') : this.props.selectedItem);

    res.props['vz-item-selected'] = `vz-${selected}Item`;

    const tabBarItems = res.props.children;

    for (const item of tabBarItems) {
      if (!item || !item.props || !item.props.id) continue;

      const itemFormatted = toCamelCase(item.props.id.startsWith('vz-') ? item.props.id.replace('vz-', '') : item.props.id);

      item.props.className = joinClassNames(item.props.className, `vz-${itemFormatted}Item`);
    }

    return res;
  });

  return () => unpatch('vz-utility-attrs-tabBar');
};
