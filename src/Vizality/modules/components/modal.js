/**
 * This file is only here to allow Powercord
 * plugins to continue to work that use them. Confirm
 * has been changed to ConfirmationModal and both have
 * been added to index.
 *
 * Prefer to use const { Modal, ConfirmationModal } = require('vizality/components');
 */

const { getModuleByDisplayName } = require('vizality/webpack');
const AsyncComponent = require('./AsyncComponent');

require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });

Object.assign(exports, {
  Confirm: AsyncComponent.from(getModuleByDisplayName('Confirm', true)),
  Modal: AsyncComponent.from(getModuleByDisplayName('DeprecatedModal', true))
});

// Re-export module properties
(async () => {
  const Modal = await getModuleByDisplayName('DeprecatedModal', true, true);
  const Confirm = await getModuleByDisplayName('Confirm', true, true);
  [ 'Header', 'Footer', 'Content', 'LazyContent', 'CloseButton', 'Sizes' ].forEach(prop => exports.Modal[prop] = Modal[prop]);
  [ 'Sizes' ].forEach(prop => exports.Confirm[prop] = Confirm[prop]);
})();
