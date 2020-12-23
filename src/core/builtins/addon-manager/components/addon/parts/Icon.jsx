import React, { memo } from 'react';

import { LazyImage } from '@vizality/components';

export default memo(({ manifest }) => {
  return (
    <div className='vz-addon-card-icon'>
      <LazyImage
        className='vz-addon-card-icon-image-wrapper'
        imageClassName='vz-addon-card-icon-img'
        src={manifest.icon}
      />
    </div>
  );
});
