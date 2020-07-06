const { inject, uninject } = require('vizality/injector');
const { getModuleByDisplayName } = require('vizality/webpack');
const { string, joinClassNames } = require('vizality/util');

/*
 * Modifies The TabBar component, which is used in various places throughout
 * Discord (settings sidebar, friends list tabs, user profile tabs). This adds
 * classes to those items to make them more easy / consistent to target.
 */

module.exports = async () => {
  const TabBar = await getModuleByDisplayName('TabBar', true);

  inject('vz-utility-classes-tabBar', TabBar.prototype, 'render', function (originalArgs, returnValue) {
    if (!returnValue.props || !returnValue.props.children) return returnValue;

    /*
     * We check if the item starts with vz- particularly for settings sidebar items
     * for core plugins.
     */
    const selected = string.toCamelCase(this.props.selectedItem.startsWith('vz-') ? this.props.selectedItem.replace('vz-', '') : this.props.selectedItem);

    returnValue.props['vz-item-selected'] = `vz-${selected}Item`;

    const tabBarItems = returnValue.props.children;

    for (const item of tabBarItems) {
      if (!item || !item.props || !item.props.id) continue;

      const itemFormatted = string.toCamelCase(item.props.id.startsWith('vz-') ? item.props.id.replace('vz-', '') : item.props.id);

      item.props.className = joinClassNames(item.props.className, `vz-${itemFormatted}Item`);
    }

    return returnValue;
  });

  return async () => uninject('vz-utility-classes-tabBar');
};
