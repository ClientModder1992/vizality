/* eslint-disable no-unreachable */
const { getModuleByDisplayName } = require('@vizality/webpack');
const { react: { findInTree } } = require('@vizality/util');
const { patch, unpatch } = require('@vizality/patcher');

module.exports = async () => {
  /* @todo: Causes problems with some popouts. 'Uncaught TypeError: res is not a function' */
  const Popout = getModuleByDisplayName('Popout');

  patch('vz-attributes-popout', Popout.prototype, 'render', (_, res) => {
    // if (!res.props) return res;

    // if (res.props.shouldShow) document.documentElement.setAttribute('vz-popout-active', '');

    // const result = res.props.onRequestClose;

    // res.props.onRequestClose = (e) => {
    //   document.documentElement.removeAttribute('vz-popout-active');

    //   return result(e);
    // };

    res.ref = elem => {
      if (elem && elem._reactInternalFiber) {
        const container = findInTree(elem._reactInternalFiber.return, el => el.stateNode, { walkable: [ 'return' ] });
        if (container.stateNode && container.stateNode.classList && container.stateNode.classList.contains('layer-v9HyYc')) {
          console.log(container.stateNode);
        }
      }
    };

    return res;
  });

  return async () => {
    unpatch('vz-attributes-popout');
    // unpatch('vz-attributes-popout-default');
  };
};
