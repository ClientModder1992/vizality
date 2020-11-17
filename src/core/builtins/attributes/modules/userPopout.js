const { react: { findInTree } } = require('@vizality/util');
const { patch, unpatch } = require('@vizality/patcher');
const { getModule } = require('@vizality/webpack');

module.exports = () => {
  const UserPopout = getModule(m => m.default && m.default.displayName === 'UserPopout');

  patch('vz-attributes-userPopout', UserPopout, 'default', (_, res) => {
    res.ref = elem => {
      if (elem && elem._reactInternalFiber) {
        const container = findInTree(elem._reactInternalFiber.return, el => el.stateNode, { walkable: [ 'return' ] });
        container.stateNode.children[0].setAttribute('vz-user-id', res.props.user.id);
        container.stateNode.parentElement.setAttribute('vz-popout', 'user');
      }
    };
    return res;
  });

  return () => unpatch('vz-attributes-userPopout');
};
