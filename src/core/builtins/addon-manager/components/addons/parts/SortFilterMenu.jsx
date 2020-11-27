const { Menu, Icon } = require('@vizality/components');
const { Messages } = require('@vizality/i18n');
const { React } = require('@vizality/react');

module.exports = React.memo(props => {
  const { onClose } = props;

  const Stars = (count) => {
    return (
      <>
        {Array.from(Array(count), () => <Icon name='Star' width='18px' height='18px' />)}
      </>
    );
  };

  return (
    <Menu.Menu navId='vz-addons-list-sort-filter-menu' onClose={onClose}>
      <Menu.MenuGroup label='Sort'>
        <Menu.MenuRadioItem
          id='sort-name'
          group='sort'
          label='Name'
          checked={true}
          action={() => void 0}
        />
        <Menu.MenuRadioItem
          id='sort-top-rated'
          group='sort'
          label='Top Rated'
          action={() => void 0}
        />
        <Menu.MenuRadioItem
          id='sort-recently-added'
          group='sort'
          label='Recently Added'
          action={() => void 0}
        />
        <Menu.MenuRadioItem
          id='sort-most-reviewed'
          group='sort'
          label='Most Reviewed'
          action={() => void 0}
        />
        <Menu.MenuRadioItem
          id='sort-most-downloaded'
          group='sort'
          label='Most Downloaded'
          action={() => void 0}
        />
      </Menu.MenuGroup>
      <Menu.MenuGroup label='Filter'>
        <Menu.MenuCheckboxItem
          id='filter-enabled'
          label='Enabled'
          checked={true}
          action={() => void 0}
        />
        <Menu.MenuCheckboxItem
          id='filter-disabled'
          label='Disabled'
          checked={true}
          action={() => void 0}
        />
        <Menu.MenuCheckboxItem
          id='filter-five-star'
          label={() => Stars(5)}
          checked={true}
          action={() => void 0}
        />
        <Menu.MenuCheckboxItem
          id='filter-four-star'
          label={() => Stars(4)}
          checked={true}
          action={() => void 0}
        />
        <Menu.MenuCheckboxItem
          id='filter-three-star'
          label={() => Stars(3)}
          checked={true}
          action={() => void 0}
        />
        <Menu.MenuCheckboxItem
          id='filter-two-star'
          label={() => Stars(2)}
          checked={true}
          action={() => void 0}
        />
        <Menu.MenuCheckboxItem
          id='filter-one-star'
          label={() => Stars(1)}
          checked={true}
          action={() => void 0}
        />
      </Menu.MenuGroup>
    </Menu.Menu>
  );
});
