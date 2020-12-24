import { getModuleByDisplayName } from '@vizality/webpack';
import { patch, unpatch } from '@vizality/patcher';
import { findInTree } from '@vizality/util/react';

export default () => {
  const UserProfile = getModuleByDisplayName('UserProfile');

  patch('vz-attributes-modal-user', UserProfile.prototype, 'render', (_, res) => {
    res.ref = elem => {
      if (elem?._reactInternalFiber) {
        const container = findInTree(elem._reactInternalFiber.return, el => el.stateNode?.setAttribute, { walkable: [ 'return' ] });
        container?.stateNode?.children[0]?.setAttribute('vz-user-id', res.props?.user?.id);
        container?.stateNode?.parentElement?.setAttribute('vz-modal', 'user');
      }
    };
    return res;
  });

  return () => unpatch('vz-attributes-modal-user');
};
