const { react: { findInTree } } = require('@vizality/util');
const { patch, unpatch } = require('@vizality/patcher');
const { getModule } = require('@vizality/webpack');

export const labels = [ 'Components', 'Popouts' ];

export default main => {
  const UserPopout = getModule(m => m.default?.displayName === 'ConnectedUserPopout');
  patch('vz-attributes-popout-user', UserPopout, 'default', (_, res) => {
    try {
      res.ref = elem => {
        if (elem && elem._reactInternalFiber) {
          const container = findInTree(elem._reactInternalFiber?.return, el => el.stateNode, { walkable: [ 'return' ] });
          container.stateNode?.children[0].setAttribute('vz-user-id', res.props.user.id);
          container.stateNode?.parentElement.setAttribute('vz-popout', 'user');
        }
      };
    } catch (err) {
      return main.error(main._labels.concat(labels.concat('User')), err);
    }
  });
  return () => unpatch('vz-attributes-popout-user');
};
