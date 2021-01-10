import React, { memo } from 'react';

import { Tooltip } from '@vizality/components';

import Description from '../parts/Description';
import Permissions from '../parts/Permissions';
import Previews from '../parts/Previews';
import AddonIcon from '../parts/Icon';
import Footer from '../parts/Footer';
import Author from '../parts/Author';

export default memo(props => {
  const { manifest, showPreviewImages } = props;

  return (
    <div className='vz-addon-card-header-wrapper'>
      {showPreviewImages && <Previews {...props} />}
      {!showPreviewImages && <AddonIcon {...props} />}
      <div className='vz-addon-card-content-wrapper'>
        <div className='vz-addon-card-content'>
          <div className='vz-addon-card-header'>
            {showPreviewImages && <AddonIcon {...props} />}
            <div className='vz-addon-card-metadata'>
              <div className='vz-addon-card-name-version'>
                <div className='vz-addon-card-name'>
                  <Tooltip text={manifest.name}>
                    {manifest.name}
                  </Tooltip>
                </div>
                <span className='vz-addon-card-version'>
                  {manifest.version}
                </span>
              </div>
              <Author manifest={manifest} />
            </div>
          </div>
          <Description description={manifest.description} />
          <Permissions permissions={manifest.permissions} />
          <Footer {...props} />
        </div>
      </div>
    </div>
  );
});
