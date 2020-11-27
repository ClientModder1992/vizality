const { shell } = require('electron');

const { string: { toPlural } } = require('@vizality/util');
const { Directories } = require('@vizality/constants');
const { Menu, Icon } = require('@vizality/components');
const { Messages } = require('@vizality/i18n');
const { React } = require('@vizality/react');

module.exports = React.memo(props => {
  const { type, resetSearchOptions, fetchMissing, enableAll, disableAll, onClose } = props;

  return (
    <Menu.Menu navId='vz-addons-list-overflow-menu' onClose={onClose}>
      <Menu.MenuItem
        id='open-folder'
        label='Show in File Explorer'
        icon={() => <Icon name='Folder' width='100%' height='100%' />}
        action={() => shell.openItem(Directories[toPlural(type).toUpperCase()])}
      />
      <Menu.MenuItem
        id='refresh-list'
        label='Refresh List'
        icon={() => <Icon name='Refresh' width='100%' height='100%' />}
        action={() => fetchMissing(type)}
      />
      <Menu.MenuSeparator />
      <Menu.MenuItem
        id='enable-all'
        label='Enable All'
        icon={() => <Icon name='Play' width='100%' height='100%' />}
        action={() => enableAll(type)}
      />
      <Menu.MenuItem
        id='disable-all'
        label='Disable All'
        icon={() => <Icon name='Pause' width='100%' height='100%' />}
        action={() => disableAll(type)}
      />
      <Menu.MenuSeparator />
      <Menu.MenuItem
        id='reset-search-options'
        label='Reset Options'
        icon={() => <Icon name='CloseCircle' width='100%' height='100%' />}
        action={() => resetSearchOptions()}
      />
    </Menu.Menu>
  );
});
