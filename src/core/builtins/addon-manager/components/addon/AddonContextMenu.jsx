const { contextMenu: { closeContextMenu } } = require('@vizality/webpack');
const { Menu } = require('@vizality/components');
const { Messages } = require('@vizality/i18n');
const { React } = require('@vizality/react');

const AddonContextHeader = React.memo(props => {
  const { manifest, type, addonId } = props;

  return (
    <>
      <div
        className='vz-addon-context-menu-header-addon-icon'
        style={{ backgroundImage: `url(vz-${type}://${addonId}/${manifest.icon})` }}
      />
      <div className='vz-addon-context-menu-header-addon-name'>
        {manifest.name}
      </div>
    </>
  );
});

module.exports = React.memo(props => {
  const { manifest, onUninstall, isEnabled, type, onToggle, addonId } = props;

  return (
    <Menu.Menu navId='vz-addon-context-menu' onClose={closeContextMenu}>
      <Menu.MenuGroup
        label={<AddonContextHeader manifest={manifest} addonId={addonId} type={type} />}
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
