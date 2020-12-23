import React, { memo } from 'react';

import { constants, getModule } from '@vizality/webpack';
import { Anchor } from '@vizality/components';

export default memo(({ manifest }) => {
  return (
    <div className='vz-addon-card-author-wrapper'>
      <Anchor
        className='vz-addon-card-author'
        vz-author-id={manifest.author.id || null}
        href={manifest.author.id
          ? `${window.location.origin}${constants.Endpoints.USERS}/${manifest.author.id}`
          : null
        }
        onClick={e => {
          e.preventDefault();
          // @todo Use Discord module for this after it's set up.
          if (!manifest.author.id) return;
          getModule('open', 'fetchProfile').open(manifest.author.id);
        }}
      >
        {typeof manifest.author === 'string'
          ? manifest.author
          : manifest.author.name
        }
      </Anchor>
    </div>
  );
});
