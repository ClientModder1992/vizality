import { getModuleByDisplayName } from '@vizality/webpack';
import { findInReactTree } from '@vizality/util/react';

import AsyncComponent from './AsyncComponent';

export default AsyncComponent.from((async () => {
  /* Thanks to Harley for this~ */
  const GuildFolderSettingsModal = getModuleByDisplayName('GuildFolderSettingsModal');
  const ModalRoot = GuildFolderSettingsModal.prototype.render.call({ props: { transitionState: 0 }, state: { name: '', color: '' } });
  const SuspendedPicker = findInReactTree(ModalRoot, n => n.props?.defaultColor).type;
  const LazyWebpackModule = await SuspendedPicker().props.children.type;
  const mdl = await (LazyWebpackModule._ctor || LazyWebpackModule._payload._result)();
  return mdl.default;
})());
