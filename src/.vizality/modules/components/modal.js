/**
 * This file is only here to allow Powercord
 * plugins to continue to work that use them. Confirm
 * has been changed to ConfirmationModal and both have
 * been added to index.
 *
 * Prefer to use const { Modal, ConfirmationModal } = require('@components');
 */

const { getModuleByDisplayName, modal } = require('@webpack');
const AsyncComponent = require('./AsyncComponent');

require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });

Object.assign(exports, {
  Confirm: AsyncComponent.from(getModuleByDisplayName('ConfirmModal', true)),
  Modal: AsyncComponent.from(getModuleByDisplayName('DeprecatedModal', true))
});

// Re-export module properties
(async () => {
  const Modal = await getModuleByDisplayName('DeprecatedModal', true, true);
  [ 'Header', 'Footer', 'Content', 'ListContent', 'CloseButton', 'Sizes' ].forEach(prop => exports.Modal[prop] = Modal[prop]);
  /*
   * ???
   * const Confirm = await getModuleByDisplayName('ConfirmModal', true, true);
   * [ 'transitionState', 'onClose' ].forEach(prop => exports.Confirm.defaultProps[prop] = Confirm.defaultProps[prop]);
   */
  exports.Confirm.defaultProps = {
    transitionState: 1,
    onClose: modal.pop
  };
})();
