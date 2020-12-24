import React, { memo } from 'react';
import { shell } from 'electron';

import { Directories } from '@vizality/constants';
import { toPlural } from '@vizality/util/string';
import { Menu } from '@vizality/components';
import { Messages } from '@vizality/i18n';

export default memo(props => {
  const { type, resetSearchOptions, fetchMissing, enableAll, disableAll, onClose } = props;

  return (
    <Menu.Menu navId='vz-addons-list-overflow-menu' onClose={onClose}>
      <Menu.MenuItem
        id='open-folder'
        label='Show in File Explorer'
        action={() => shell.openPath(Directories[toPlural(type).toUpperCase()])}
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
