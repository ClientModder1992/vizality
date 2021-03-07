import React, { memo } from 'react';

import { ContextMenu, LazyImage } from '@vizality/components';
import { contextMenu } from '@vizality/webpack';
import { Messages } from '@vizality/i18n';

const { closeContextMenu } = contextMenu;

export default memo(props => {
  const { manifest, onUninstall, isEnabled, onToggle } = props;

  return (
    <ContextMenu.Menu navId='vz-addon-context-menu' onClose={closeContextMenu}>
      {/* <ContextMenu.Group
        label={<>
          <div className='vz-addon-context-menu-header-addon-icon'>
            <LazyImage
              className='vz-addon-context-menu-header-addon-icon-image-wrapper'
              imageClassName='vz-addon-context-menu-header-addon-icon-img'
              src={manifest.icon}
            />
          </div>
          <div className='vz-addon-context-menu-header-addon-name'>
            {manifest.name}
          </div>
        </>}
        aria-label='vz-addon-context-menu-header'
        className='vz-addon-context-menu-header'
      > */}
      {!onUninstall
        ? null
        : isEnabled
          ? <ContextMenu.Item
            id='disable'
            label='Disable'
            action={() => onToggle(false)}
          />
          : <ContextMenu.Item
            id='enable'
            label='Enable'
            action={() => onToggle(true)}
          />
      }
      <ContextMenu.Item
        id='settings'
        label='Settings'
        action={() => void 0}
      />
      <ContextMenu.Item
        id='details'
        label='Details'
        action={() => void 0}
      />
      {onUninstall
        ? <ContextMenu.Item
          id='uninstall'
          label='Uninstall'
          color='colorDanger'
          action={() => void 0}
        />
        : <ContextMenu.Item
          id='install'
          label='Install'
          color='colorSuccess'
          action={() => void 0}
        />
      }
      <ContextMenu.Separator />
      <ContextMenu.Item
        id='copy-link'
        label='Copy Link'
        action={() => void 0}
      />
      <ContextMenu.Item
        id='copy-id'
        label='Copy ID'
        action={() => void 0}
      />
      {/* </ContextMenu.Group> */}
    </ContextMenu.Menu>
  );
});
