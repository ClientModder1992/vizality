import React, { memo, useState } from 'react';

import { ContextMenu, Icon } from '@vizality/components';
import { Messages } from '@vizality/i18n';

export default memo(props => {
  const { onClose, handleDisplayChange, showPreviewImages, handleShowPreviewImages, display } = props;
  const [ previewImages, setShowPreviewImages ] = useState(showPreviewImages);

  return (
    <ContextMenu.Menu navId='vz-addons-list-display-menu' onClose={onClose}>
      <ContextMenu.Group>
        <ContextMenu.Item
          id='compact'
          label='Compact'
          icon={() => <Icon name='LayoutCompact' size='18px' />}
          action={() => handleDisplayChange('compact')}
          disabled={display === 'compact'}
        />
        <ContextMenu.Item
          id='cover'
          label='Cover'
          icon={() => <Icon name='LayoutCover' size='18px' />}
          action={() => handleDisplayChange('cover')}
          disabled={display === 'cover'}
        />
        <ContextMenu.Item
          id='card'
          label='Card'
          icon={() => <Icon name='LayoutCard' size='18px' />}
          action={() => handleDisplayChange('card')}
          disabled={display === 'card'}
        />
        <ContextMenu.Item
          id='list'
          label='List'
          icon={() => <Icon name='LayoutList' size='18px' />}
          action={() => handleDisplayChange('list')}
          disabled={display === 'list'}
        />
      </ContextMenu.Group>
      <ContextMenu.Separator />
      <ContextMenu.CheckboxItem
        id='show-previews'
        label='Show Previews'
        disabled={display === 'compact' || display === 'cover'}
        checked={previewImages}
        action={() => {
          setShowPreviewImages(!previewImages);
          handleShowPreviewImages(!previewImages);
        }}
      />
    </ContextMenu.Menu>
  );
});
