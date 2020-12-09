const { getModuleByDisplayName } = require('@vizality/webpack');
const { react: { findInTree } } = require('@vizality/util');
const { patch, unpatch } = require('@vizality/patcher');

module.exports = () => {
  const UserProfile = getModuleByDisplayName('UserProfile');

  patch('vz-attributes-modal-user', UserProfile.prototype, 'render', (_, res) => {
    res.ref = elem => {
      if (elem && elem._reactInternalFiber) {
        const container = findInTree(elem._reactInternalFiber?.return, el => el.stateNode && el.stateNode?.setAttribute, { walkable: [ 'return' ] });
        container.stateNode?.children[0].setAttribute('vz-user-id', res.props.user.id);
        container.stateNode?.parentElement.setAttribute('vz-modal', 'user');
      }
    };
    return res;
  });

  return () => unpatch('vz-attributes-modal-user');
};
