import React, { memo, useEffect, useState } from 'react';

import { ApplicationStoreListingCarousel } from '@vizality/components';

export default memo(props => {
  const { hasPreviewImages, previewImages } = props;
  const [ previews, setPreviews ] = useState([]);

  const getPreviewImages = () => {
    const previewImgs = [];
    previewImages.forEach(image => {
      previewImgs.push({
        src: image,
        type: 1
      });
    });
    setPreviews(previewImgs);
  };

  useEffect(() => {
    getPreviewImages();
  }, []);

  return (
    <div className='vz-addon-card-previews-wrapper'>
      {hasPreviewImages
        ? <div className='vz-addon-card-previews-inner' vz-count={previewImages.slice(0, 4).length}>
          <ApplicationStoreListingCarousel
            pageSize='small'
            paused='true'
            items={previews.slice(0, 4)}
          />
        </div>
        : <div className='vz-addon-card-previews-empty'>
          <div className='vz-addon-card-previews-empty-inner'>
            <div className='vz-addon-card-previews-empty-text'>
              No Preview Images Found
            </div>
          </div>
        </div>
      }
    </div>
  );
});
