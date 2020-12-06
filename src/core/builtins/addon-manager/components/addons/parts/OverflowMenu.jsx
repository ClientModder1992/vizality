const { shell } = require('electron');

const { React } = require('@vizality/react');
const { string: { toPlural } } = require('@vizality/util');
const { Directories } = require('@vizality/constants');
const { Menu, Icon } = require('@vizality/components');
const { Messages } = require('@vizality/i18n');

module.exports = React.memo(props => {
  const { type, resetSearchOptions, fetchMissing, enableAll, disableAll, onClose } = props;

  return (
    <Menu.Menu navId='vz-addons-list-overflow-menu' onClose={onClose}>
      <Menu.MenuItem
        id='open-folder'
        label='Show in File Explorer'
        icon={() => <Icon name='Folder' size='16px' />}
        action={() => shell.openItem(Directories[toPlural(type).toUpperCase()])}
      />
      <Menu.MenuItem
        id='refresh-list'
        label='Refresh List'
        action={() => fetchMissing(type)}
      />
      <Menu.MenuItem
        id='reset-search-options'
        label='Reset Options'
        action={() => resetSearchOptions()}
      />
      <Menu.MenuSeparator />
      <Menu.MenuItem
        id='enable-all'
        label='Enable All'
        action={() => enableAll(type)}
      />
      <Menu.MenuItem
        id='disable-all'
        label='Disable All'
        action={() => disableAll(type)}
      />
    </Menu.Menu>
  );
});
