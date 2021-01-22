import React, { memo } from 'react';

import { toPlural } from '@vizality/util/string';
import { contextMenu } from '@vizality/webpack';

import AddonContextMenu from './AddonContextMenu';
import Inner from './parts/Inner';

const { openContextMenu } = contextMenu;

export default memo(props => {
  const { type, addonId, hasPreviewImages, previewImages } = props;

  const handleContextMenu = e => {
    return openContextMenu(e, () =>
      <AddonContextMenu {...props} />
    );
  };

  return (
    <div
      className='vz-addon-card'
      vz-addon-id={addonId}
      onContextMenu={e => handleContextMenu(e)}
      onClick={e => {
        if (e.target.classList.contains('smallCarouselImage-2Qvg9S')) return;
        if (e.target.matches('input') || e.target.matches('button') || e.target.matches('svg') || e.target.matches('a')) return;

        vizality.api.routes.navigate(`/vizality/dashboard/${toPlural(type)}/${addonId}`);
      }}
    >
      <Inner {...props} hasPreviewImages={hasPreviewImages} previewImages={previewImages} />
    </div>
  );
});
