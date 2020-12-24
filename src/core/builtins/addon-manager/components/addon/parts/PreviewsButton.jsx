import React, { memo, useEffect, useState } from 'react';

import { ImageCarouselModal, Icon } from '@vizality/components';
import { open as openModal } from '@vizality/modal';

export default memo(props => {
  const { size, previewImages } = props;
  const [ previews, setPreviews ] = useState([]);

  const getPreviewImages = () => {
    const previewImgs = [];
    previewImages.forEach(image => {
      previewImgs.push({
        src: image
      });
    });
    setPreviews(previewImgs);
  };

  useEffect(() => {
    getPreviewImages();
  }, []);

  return (
    <div className='vz-addon-card-show-previews-button'>
      <Icon
        className='vz-addon-card-show-previews-button-icon-wrapper'
        iconClassName='vz-addon-card-show-previews-button-icon'
        name='Eye'
        size={size}
        tooltip='Previews'
        onMouseUp={() => openModal(() => <ImageCarouselModal items={previews} />)}
      />
    </div>
  );
});
