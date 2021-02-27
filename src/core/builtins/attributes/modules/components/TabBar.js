import { getModuleByDisplayName } from '@vizality/webpack';
import { toKebabCase } from '@vizality/util/string';
import { patch, unpatch } from '@vizality/patcher';

/*
 * Modifies The TabBar component, which is used in various places throughout
 * Discord (settings sidebar, friends list tabs, user profile tabs).
 * This adds classes to those items to make them more easy / consistent to target.
 */
export default () => {
  const TabBar = getModuleByDisplayName('TabBar');
  patch('vz-attributes-tab-bar', TabBar.prototype, 'render', function (_, res) {
    const { selectedItem } = this.props;
    res.props['vz-tab-selected'] = toKebabCase(selectedItem);
  });

  patch('vz-attributes-tab-bar-tabs', TabBar.Item?.prototype, 'render', function (_, res) {
    const { id, selectedItem } = this.props;
    if (!id || !selectedItem) return;
    const active = Boolean(String(id)?.toLowerCase() === String(selectedItem)?.toLowerCase());
    res.props['vz-active'] = active;
    res.props['vz-tab'] = toKebabCase(id);
  });

  return () => {
    unpatch('vz-attributes-tab-bar');
    unpatch('vz-attributes-tab-bar-tabs');
  };
};
