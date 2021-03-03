import { getModuleByDisplayName } from '@vizality/webpack';
import { toKebabCase } from '@vizality/util/string';
import { patch, unpatch } from '@vizality/patcher';

export const labels = [ 'Components' ];

export default main => {
  const TabBar = getModuleByDisplayName('TabBar');
  patch('vz-attributes-tab-bar', TabBar.prototype, 'render', function (_, res) {
    try {
      const selectedItem = this?.props?.selectedItem;
      selectedItem && (res.props['vz-tab-selected'] = toKebabCase(selectedItem));
    } catch (err) {
      return main.error(main._labels.concat(labels.concat('TabBar')), err);
    }
  });

  patch('vz-attributes-tab-bar-tabs', TabBar.Item?.prototype, 'render', function (_, res) {
    try {
      if (!this?.props?.id || !this.props.selectedItem) return;
      const active = Boolean(String(this.props.id).toLowerCase() === String(this.props.selectedItem)?.toLowerCase());
      res.props['vz-active'] = active && '';
      res.props['vz-tab'] = toKebabCase(this.props.id);
    } catch (err) {
      return main.error(main._labels.concat(labels.concat('TabBarItem')), err);
    }
  });

  return () => {
    unpatch('vz-attributes-tab-bar');
    unpatch('vz-attributes-tab-bar-tabs');
  };
};
