const { React, React: { useState } } = require('@vizality/react');
const { Menu, Icon } = require('@vizality/components');
const { Messages } = require('@vizality/i18n');

module.exports = React.memo(props => {
  const { onClose, handleDisplayChange, showPreviewImages, handleShowPreviewImages, display } = props;
  const [ previewImages, setShowPreviewImages ] = useState(showPreviewImages);

  return (
    <Menu.Menu navId='vz-addons-list-display-menu' onClose={onClose}>
      <Menu.MenuGroup>
        <Menu.MenuItem
          id='compact'
          label='Compact'
          icon={() => <Icon name='LayoutTable' size='18px' />}
          action={() => handleDisplayChange('table')}
        />
        <Menu.MenuItem
          id='cover'
          label='Cover'
          icon={() => <Icon name='LayoutGridSmall' size='18px' />}
          action={() => handleDisplayChange('grid-small')}
        />
        <Menu.MenuItem
          id='card'
          label='Card'
          icon={() => <Icon name='LayoutGrid' size='18px' />}
          action={() => handleDisplayChange('grid')}
        />
        <Menu.MenuItem
          id='list'
          label='List'
          icon={() => <Icon name='LayoutList' size='18px' />}
          action={() => handleDisplayChange('list')}
        />
      </Menu.MenuGroup>
      <Menu.MenuSeparator />
      <Menu.MenuCheckboxItem
        id='show-preview-images'
        label='Show Preview Images'
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
