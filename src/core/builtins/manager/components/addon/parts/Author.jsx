import React, { memo } from 'react';

import { Anchor } from '@vizality/components';

export default memo(({ manifest }) => {
  return (
    <div className='vz-addon-card-author-wrapper'>
      <Anchor
        type='user'
        userId={manifest.author.id}
        className='vz-addon-card-author'
      >
        {typeof manifest.author === 'string'
          ? manifest.author
          : manifest.author.name
        }
      </Anchor>
    </div>
  );
});
