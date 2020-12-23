import React, { memo, useReducer } from 'react';

import { Icon, Switch, Tooltip } from '@vizality/components';

import PreviewsButton from '../parts/PreviewsButton';
import AddonIcon from '../parts/Icon';
import Author from '../parts/Author';

export default memo(props => {
  const { manifest, isEnabled, onToggle, onUninstall, hasPreviewImages } = props;
  const [ , forceUpdate ] = useReducer(x => x + 1, 0);

  return (
    <div className='vz-addon-card-header-wrapper'>
      <div className='vz-addon-card-content-wrapper'>
        <div className='vz-addon-card-content'>
          <div className='vz-addon-card-header'>
            <AddonIcon {...props} />
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
                {hasPreviewImages && <PreviewsButton {...props} size='18px' />}
              </div>
              <Author manifest={manifest} />
            </div>
            {false && <Details {...props} />}
            <div className='vz-addon-card-actions'>
              {onUninstall &&
                <div className='vz-addon-card-uninstall'>
                  <Icon
                    className='vz-addon-card-uninstall-button-wrapper'
                    iconClassName='vz-addon-card-uninstall-button'
                    name='Trash'
                    tooltip='Uninstall'
                    onClick={e => {
                      e.stopPropagation();
                      onUninstall();
                    }}
                  />
                </div>
              }
              <div className='vz-addon-card-settings'>
                <Icon
                  className='vz-addon-card-settings-button-wrapper'
                  iconClassName='vz-addon-card-settings-button'
                  name='Gear'
                  tooltip='Settings'
                  onClick={() => void 0}
                />
              </div>
              <div className='vz-addon-card-toggle-wrapper'>
                <Switch
                  className='vz-addon-card-toggle'
                  value={isEnabled}
                  onChange={v => {
                    onToggle(v.target.checked);
                    forceUpdate();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
