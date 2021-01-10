import React, { memo } from 'react';

export default memo(({ description }) => {
  return <div className='vz-addon-card-description'>{description}</div>;
});
