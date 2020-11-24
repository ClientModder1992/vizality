const { shell } = require('electron');

const { contextMenu: { closeContextMenu } } = require('@vizality/webpack');
const { string: { toHeaderCase, toPlural } } = require('@vizality/util');
const { React, React: { useReducer } } = require('@vizality/react');
const { Directories } = require('@vizality/constants');
const { Menu } = require('@vizality/components');
const { Messages } = require('@vizality/i18n');

module.exports = React.memo(({ type, actions }) => {
  const [ , forceUpdate ] = useReducer(x => x + 1, 0);

  return (
    <Menu.Menu navId='vz-addons-list-overflow-menu' onClose={closeContextMenu}>
      <Menu.MenuItem
        id={`open-${toPlural(type)}-folder`}
        label={Messages.VIZALITY_ADDONS_OPEN_FOLDER.format({ type: toHeaderCase(type) })}
        action={() => shell.openItem(Directories[type])}
      />
      <Menu.MenuItem
        id='refresh-list'
        label='Refresh List'
        action={() => actions.fetchMissing(type)}
      />
      <Menu.MenuSeparator />
      <Menu.MenuItem
        id='enable-all'
        label='Enable All'
        action={() => actions.enableAll(type)}
      />
      <Menu.MenuItem
        id='disable-all'
        label='Disable All'
        action={() => actions.disableAll(type)}
      />
    </Menu.Menu>
  );
});
