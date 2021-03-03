import { getModuleByDisplayName } from '@vizality/webpack';
import { patch, unpatch } from '@vizality/patcher';

export const labels = [ 'Components' ];

export default main => {
  const ContextMenu = getModuleByDisplayName('FluxContainer(ContextMenus)');
  patch('vz-attributes-context-menu', ContextMenu?.prototype, 'render', (_, res) => {
    try {
      if (!res.props) return;
      const root = document.documentElement;
      res.props.isOpen
        ? root.setAttribute('vz-context-menu-active', '')
        : root.removeAttribute('vz-context-menu-active');
    } catch (err) {
      main.error(main._labels.concat(labels.concat('ContextMenu')), err);
    }
  });
  return () => unpatch('vz-attributes-context-menu');
};
