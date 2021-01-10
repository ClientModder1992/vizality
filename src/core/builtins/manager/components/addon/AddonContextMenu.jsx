import React, { memo } from 'react';

import { Menu, LazyImage } from '@vizality/components';
import { contextMenu } from '@vizality/webpack';
import { Messages } from '@vizality/i18n';

const { closeContextMenu } = contextMenu;

export default memo(props => {
  const { manifest, onUninstall, isEnabled, onToggle } = props;

  return (
    <Menu.Menu navId='vz-addon-context-menu' onClose={closeContextMenu}>
      <Menu.MenuGroup
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
      >
        {!onUninstall
          ? null
          : isEnabled
            ? <Menu.MenuItem
              id='disable'
              label='Disable'
              action={() => onToggle(false)}
            />
            : <Menu.MenuItem
              id='enable'
              label='Enable'
              action={() => onToggle(true)}
            />
        }
        <Menu.MenuItem
          id='settings'
          label='Settings'
          action={() => void 0}
        />
        <Menu.MenuItem
          id='details'
          label='Details'
          action={() => void 0}
        />
        {onUninstall
          ? <Menu.MenuItem
            id='uninstall'
            label='Uninstall'
            color='colorDanger'
            action={() => void 0}
          />
          : <Menu.MenuItem
            id='install'
            label='Install'
            color='colorSuccess'
            action={() => void 0}
          />
        }
        <Menu.MenuSeparator />
        <Menu.MenuItem
          id='copy-link'
          label='Copy Link'
          action={() => void 0}
        />
        <Menu.MenuItem
          id='copy-id'
          label='Copy ID'
          action={() => void 0}
        />
      </Menu.MenuGroup>
    </Menu.Menu>
  );
});
