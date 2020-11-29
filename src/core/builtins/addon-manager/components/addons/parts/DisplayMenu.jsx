const { Menu, Icon } = require('@vizality/components');
const { Messages } = require('@vizality/i18n');
const { React } = require('@vizality/react');

module.exports = React.memo(props => {
  const { onClose, handleDisplayChange } = props;

  return (
    <Menu.Menu navId='vz-addons-list-display-menu' onClose={onClose}>
      <Menu.MenuGroup>
        <Menu.MenuItem
          id='display-table'
          label={<Icon name='LayoutTable' size='24px' />}
          action={() => handleDisplayChange('table')}
        />
        <Menu.MenuItem
          id='display-grid-small'
          label={<Icon name='LayoutGridSmall' size='24px' />}
          action={() => handleDisplayChange('grid-small')}
        />
        <Menu.MenuItem
          id='display-grid'
          label={<Icon name='LayoutGrid' size='24px' />}
          action={() => handleDisplayChange('grid')}
        />
        <Menu.MenuItem
          id='display-list'
          label={<Icon name='LayoutList' size='24px' />}
          action={() => handleDisplayChange('list')}
        />
      </Menu.MenuGroup>
    </Menu.Menu>
  );
});
