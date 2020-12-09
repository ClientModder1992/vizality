const { getModuleByDisplayName } = require('@vizality/webpack');
const { react: { findInTree } } = require('@vizality/util');
const { patch, unpatch } = require('@vizality/patcher');

module.exports = async () => {
  const ModalCarousel = getModuleByDisplayName('componentDispatchSubscriber(ModalCarousel)');

  patch('vz-attributes-modal-image-carousel', ModalCarousel.prototype, 'render', (_, res) => {
    const ogRef = res.ref;

    res.ref = elem => {
      const r = ogRef(elem);
      if (elem && elem._reactInternalFiber) {
        const container = findInTree(elem._reactInternalFiber?.return, el => el.stateNode && el.stateNode?.setAttribute, { walkable: [ 'return' ] });
        container.stateNode?.parentElement.setAttribute('vz-modal', 'image-carousel');
        container.stateNode.children[0].style.width = `${res.props?.items[res.props?.startWith].width}px`;
      }
      return r;
    };

    return res;
  });

  return () => unpatch('vz-attributes-modal-image-carousel');
};
