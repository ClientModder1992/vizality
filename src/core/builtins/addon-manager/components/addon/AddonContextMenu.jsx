const { contextMenu: { closeContextMenu } } = require('@vizality/webpack');
const { Menu, Icon } = require('@vizality/components');
const { Messages } = require('@vizality/i18n');
const { React, React: { useReducer } } = require('@vizality/react');
const { string: { toHeaderCase, toPlural } } = require('@vizality/util');

const AddonContextHeader = React.memo(({ manifest }) => {
  return (
    <>
      <div
        className='vz-addon-context-menu-header-addon-icon'
        style={{ backgroundImage: 'url(https://extensions-discovery-images.twitch.tv/wi08ebtatdc7oj83wtl9uxwz807l8b/1.1.92/logo659f7669-7978-4c89-9824-0fc19d37ef93)' }}
      />
      <div className='vz-addon-context-menu-header-addon-name'>
        {manifest.name}
      </div>
    </>
  );
});

module.exports = React.memo(({ manifest, onUninstall, isEnabled, type, onToggle, addonId }) => {
  return (
    <Menu.Menu navId='vz-addon-context-menu' onClose={closeContextMenu}>
      <Menu.MenuGroup
        label={<AddonContextHeader manifest={manifest} />}
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
