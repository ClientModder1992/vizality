const { inject, uninject } = require('vizality/injector');
const { getModuleByDisplayName } = require('vizality/webpack');

module.exports = async () => {
  const ContextMenu = await getModuleByDisplayName('FluxContainer(ContextMenus)', true);

  inject('vz-utility-classes-contextMenu', ContextMenu.prototype, 'render', (originalArgs, returnValue) => {
    if (!returnValue.props) return returnValue;

    if (returnValue.props.isOpen) document.documentElement.setAttribute('vz-context-menu-active', '');
    else document.documentElement.removeAttribute('vz-context-menu-active');

    return returnValue;
  });

  return async () => uninject('vz-utility-classes-contextMenu');
};
