import { ContextMenu, Icon } from '@vizality/components';
import I18n from '@vizality/i18n';
import React from 'react';

export default React.memo(props => {
  const { onClose, handleDisplayChange, showPreviewImages, handleShowPreviewImages, display: _display } = props;
  const [ previewImages, setShowPreviewImages ] = React.useState(showPreviewImages);
  const [ display, setDisplay ] = React.useState(_display);

  return (
    <ContextMenu.Menu navId='vz-addons-list-display-menu' onClose={onClose}>
      <ContextMenu.Group label='Layout'>
        <ContextMenu.RadioItem
          id='compact'
          group='layout'
          label={() => (
            <div className='vz-addon-context-menu-label-inner'>
              <Icon name='LayoutCompact' size='18' />
              Compact
            </div>
          )}
          checked={display === 'compact'}
          action={() => {
            setDisplay('compact');
            handleDisplayChange('compact');
          }}
        />
        <ContextMenu.RadioItem
          id='cover'
          group='layout'
          label={() => (
            <div className='vz-addon-context-menu-label-inner'>
              <Icon name='LayoutCover' size='18' />
              Cover
            </div>
          )}
          checked={display === 'cover'}
          action={() => {
            setDisplay('cover');
            handleDisplayChange('cover');
          }}
        />
        <ContextMenu.RadioItem
          id='card'
          group='layout'
          label={() => (
            <div className='vz-addon-context-menu-label-inner'>
              <Icon name='LayoutCard' size='18' />
              Card
            </div>
          )}
          checked={display === 'card'}
          action={() => {
            setDisplay('card');
            handleDisplayChange('card');
          }}
        />
        <ContextMenu.RadioItem
          id='list'
          group='layout'
          label={() => (
            <div className='vz-addon-context-menu-label-inner'>
              <Icon name='LayoutList' size='18' />
              List
            </div>
          )}
          checked={display === 'list'}
          action={() => {
            setDisplay('list');
            handleDisplayChange('list');
          }}
        />
      </ContextMenu.Group>
      <ContextMenu.Separator />
      <ContextMenu.CheckboxItem
        id='show-banners'
        label='Show Banners'
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
