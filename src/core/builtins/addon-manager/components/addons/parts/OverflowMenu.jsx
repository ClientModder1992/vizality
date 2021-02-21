import React, { memo } from 'react';
import { shell } from 'electron';

import { ContextMenu } from '@vizality/components';
import { Directories } from '@vizality/constants';
import { toPlural } from '@vizality/util/string';
import { Messages } from '@vizality/i18n';

export default memo(props => {
  const { type, resetSearchOptions, enableAll, disableAll, onClose } = props;

  return (
    <ContextMenu.Menu navId='vz-addons-list-overflow-menu' onClose={onClose}>
      <ContextMenu.Item
        id='open-folder'
        label='Show in File Explorer'
        action={() => shell.openPath(Directories[toPlural(type).toUpperCase()])}
      />
      <ContextMenu.Item
        id='reset-search-options'
        label='Reset Options'
        action={() => resetSearchOptions()}
      />
      <ContextMenu.Separator />
      <ContextMenu.Item
        id='enable-all'
        label='Enable All'
        action={async () => enableAll(type)}
      />
      <ContextMenu.Item
        id='disable-all'
        label='Disable All'
        action={async () => disableAll(type)}
      />
    </ContextMenu.Menu>
  );
});
