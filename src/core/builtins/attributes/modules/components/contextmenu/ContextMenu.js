import { getModuleByDisplayName } from '@vizality/webpack';
import { patch, unpatch } from '@vizality/patcher';

export default () => {
  const ContextMenu = getModuleByDisplayName('FluxContainer(ContextMenus)');

  patch('vz-attributes-context-menu', ContextMenu.prototype, 'render', (_, res) => {
    if (!res.props) return res;

    const root = document.documentElement;

    res.props?.isOpen
      ? root.setAttribute('vz-context-menu-active', '')
      : root.removeAttribute('vz-context-menu-active');

    return res;
  });

  return () => unpatch('vz-attributes-context-menu');
};
