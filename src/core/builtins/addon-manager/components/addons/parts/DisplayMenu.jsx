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
          label={<Icon name='LayoutTable' width='18px' height='18px' />}
          checked={true}
          action={() => void 0}
        />
        <Menu.MenuItem
          id='display-grid-small'
          label={<Icon name='LayoutGridSmall' width='18px' height='18px' />}
          action={() => void 0}
        />
        <Menu.MenuItem
          id='display-grid'
          label={<Icon name='LayoutGrid' width='18px' height='18px' />}
          action={() => void 0}
        />
        <Menu.MenuItem
          id='display-list'
          label={<Icon name='LayoutList' width='18px' height='18px' />}
          action={() => void 0}
        />
      </Menu.MenuGroup>
    </Menu.Menu>
  );
});
