const { react: { findInTree } } = require('@vizality/util');
const { patch, unpatch } = require('@vizality/patcher');
const { getModuleByDisplayName } = require('@vizality/webpack');

module.exports = () => {
  const UserProfile = getModuleByDisplayName('UserProfile');

  patch('vz-attributes-userProfile', UserProfile.prototype, 'render', (_, res) => {
    res.ref = elem => {
      if (elem && elem._reactInternalFiber) {
        const container = findInTree(elem._reactInternalFiber.return, el => el.stateNode && el.stateNode.setAttribute, { walkable: [ 'return' ] });
        container.stateNode.children[0].setAttribute('vz-user-id', res.props.user.id);
        container.stateNode.parentElement.setAttribute('vz-modal', 'user');
      }
    };
    return res;
  });

  return () => unpatch('vz-attributes-userProfile');
};
