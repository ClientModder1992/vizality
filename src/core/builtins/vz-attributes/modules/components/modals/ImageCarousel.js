import { getModuleByDisplayName } from '@vizality/webpack';
import { patch, unpatch } from '@vizality/patcher';
import { findInTree } from '@vizality/util/react';

export default () => {
  const ModalCarousel = getModuleByDisplayName('componentDispatchSubscriber(ModalCarousel)');

  patch('vz-attributes-modal-image-carousel', ModalCarousel.prototype, 'render', (_, res) => {
    const ogRef = res.ref;

    res.ref = elem => {
      const r = ogRef(elem);
      if (elem && elem._reactInternalFiber) {
        const container = findInTree(elem._reactInternalFiber?.return, el => el.stateNode && el.stateNode?.setAttribute, { walkable: [ 'return' ] });
        container.stateNode?.parentElement.setAttribute('vz-modal', 'image-carousel');
      }

      return r;
    };

    return res;
  });

  return () => unpatch('vz-attributes-modal-image-carousel');
};
