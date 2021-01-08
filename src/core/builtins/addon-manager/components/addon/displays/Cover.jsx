import React, { memo } from 'react';

import { Tooltip } from '@vizality/components';

import Description from '../parts/Description';
import Permissions from '../parts/Permissions';
import AddonIcon from '../parts/Icon';
import Footer from '../parts/Footer';
import Author from '../parts/Author';

export default memo(props => {
  const { manifest } = props;

  return (
    <div className='vz-addon-card-header-wrapper'>
      <div className='vz-addon-card-content-wrapper'>
        <div className='vz-addon-card-content'>
          <AddonIcon {...props} />
          <div className='vz-addon-card-header'>
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
