const { shell } = require('electron');

const { string: { toPlural } } = require('@vizality/util');
const { Directories } = require('@vizality/constants');
const { Menu, Icon } = require('@vizality/components');
const { Messages } = require('@vizality/i18n');
const { React, React: { useReducer, useState } } = require('@vizality/react');

module.exports = React.memo(props => {
  const { type, showPreviewImages, resetSearchOptions, handleShowPreviewImages, fetchMissing, enableAll, disableAll, onClose, displayType } = props;
  const [ previewImages, setShowPreviewImages ] = useState(showPreviewImages);

  return (
    <Menu.Menu navId='vz-addons-list-overflow-menu' onClose={onClose}>
      <Menu.MenuItem
        id='open-folder'
        label='Show in File Explorer'
        icon={() => <Icon name='Folder' size='18px' />}
        action={() => shell.openItem(Directories[toPlural(type).toUpperCase()])}
      />
      <Menu.MenuItem
        id='refresh-list'
        label='Refresh List'
        icon={() => <Icon name='Refresh' size='18px' />}
        action={() => fetchMissing(type)}
      />
      <Menu.MenuItem
        id='reset-search-options'
        label='Reset Options'
        icon={() => <Icon name='CloseCircle' size='18px' />}
        action={() => resetSearchOptions()}
      />
      <Menu.MenuSeparator />
      <Menu.MenuItem
        id='enable-all'
        label='Enable All'
        icon={() => <Icon name='Play2' size='18px' />}
        action={() => enableAll(type)}
      />
      <Menu.MenuItem
        id='disable-all'
        label='Disable All'
        icon={() => <Icon name='Pause2' size='18px' />}
        action={() => disableAll(type)}
      />
      <Menu.MenuSeparator />
      <Menu.MenuCheckboxItem
        id='show-preview-images'
        label='Show Preview Images'
        disabled={displayType === 'table' || displayType === 'grid-small'}
        checked={previewImages}
        action={() => {
          setShowPreviewImages(!previewImages);
          handleShowPreviewImages(!previewImages);
        }}
      />
    </Menu.Menu>
  );
});
