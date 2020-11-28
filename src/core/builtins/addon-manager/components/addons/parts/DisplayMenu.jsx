const { Menu, Icon } = require('@vizality/components');
const { Messages } = require('@vizality/i18n');
const { React } = require('@vizality/react');

module.exports = React.memo(props => {
  const { onClose } = props;

  return (
    <Menu.Menu navId='vz-addons-list-display-menu' onClose={onClose}>
      <Menu.MenuGroup>
        <Menu.MenuItem
          id='display-table'
          label={<Icon name='LayoutTable' size='18px' />}
          checked={true}
          action={() => void 0}
        />
        <Menu.MenuItem
          id='display-grid-small'
          label={<Icon name='LayoutGridSmall' size='18px' />}
          action={() => void 0}
        />
        <Menu.MenuItem
          id='display-grid'
          label={<Icon name='LayoutGrid' size='18px' viewBox='4 4 16 16' />}
          action={() => void 0}
        />
        <Menu.MenuItem
          id='display-list'
          label={<Icon name='LayoutList' size='18px' />}
          action={() => void 0}
        />
      </Menu.MenuGroup>
    </Menu.Menu>
  );
});
