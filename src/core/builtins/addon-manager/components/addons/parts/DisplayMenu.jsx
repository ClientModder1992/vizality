import React, { memo, useState } from 'react';

import { Menu, Icon } from '@vizality/components';
import { Messages } from '@vizality/i18n';

export default memo(props => {
  const { onClose, handleDisplayChange, showPreviewImages, handleShowPreviewImages, display } = props;
  const [ previewImages, setShowPreviewImages ] = useState(showPreviewImages);

  return (
    <Menu.Menu navId='vz-addons-list-display-menu' onClose={onClose}>
      <Menu.MenuGroup>
        <Menu.MenuItem
          id='compact'
          label='Compact'
          icon={() => <Icon name='LayoutCompact' size='18px' />}
          action={() => handleDisplayChange('compact')}
          disabled={display === 'compact'}
        />
        <Menu.MenuItem
          id='cover'
          label='Cover'
          icon={() => <Icon name='LayoutCover' size='18px' />}
          action={() => handleDisplayChange('cover')}
          disabled={display === 'cover'}
        />
        <Menu.MenuItem
          id='card'
          label='Card'
          icon={() => <Icon name='LayoutCard' size='18px' />}
          action={() => handleDisplayChange('card')}
          disabled={display === 'card'}
        />
        <Menu.MenuItem
          id='list'
          label='List'
          icon={() => <Icon name='LayoutList' size='18px' />}
          action={() => handleDisplayChange('list')}
          disabled={display === 'list'}
        />
      </Menu.MenuGroup>
      <Menu.MenuSeparator />
      <Menu.MenuCheckboxItem
        id='show-previews'
        label='Show Previews'
        disabled={display === 'compact' || display === 'cover'}
        checked={previewImages}
        action={() => {
          setShowPreviewImages(!previewImages);
          handleShowPreviewImages(!previewImages);
        }}
      />
    </Menu.Menu>
  );
});
