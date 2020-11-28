const { Menu, Icon } = require('@vizality/components');
const { Messages } = require('@vizality/i18n');
const { React } = require('@vizality/react');

module.exports = React.memo(props => {
  const { onClose, updateSetting, handleDisplay } = props;

  return (
    <Menu.Menu navId='vz-addons-list-display-menu' onClose={onClose}>
      <Menu.MenuGroup>
        <Menu.MenuItem
          id='display-table'
          label={<Icon name='LayoutTable' size='24px' />}
          action={() => {
            handleDisplay('table');
            updateSetting('addon-list-display', 'table');
          }}
        />
        <Menu.MenuItem
          id='display-grid-small'
          label={<Icon name='LayoutGridSmall' size='24px' />}
          action={() => {
            handleDisplay('grid-small');
            updateSetting('addon-list-display', 'grid-small');
          }}
        />
        <Menu.MenuItem
          id='display-grid'
          label={<Icon name='LayoutGrid' size='24px' />}
          action={() => {
            handleDisplay('grid');
            updateSetting('addon-list-display', 'grid');
          }}
        />
        <Menu.MenuItem
          id='display-list'
          label={<Icon name='LayoutList' size='24px' />}
          action={() => {
            handleDisplay('list');
            updateSetting('addon-list-display', 'list');
          }}
        />
      </Menu.MenuGroup>
    </Menu.Menu>
  );
});
