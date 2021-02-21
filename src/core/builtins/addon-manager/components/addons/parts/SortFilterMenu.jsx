import React, { memo } from 'react';

import { ContextMenu, Icon } from '@vizality/components';
import { Messages } from '@vizality/i18n';

export default memo(props => {
  const { onClose } = props;

  const Stars = (count) => {
    return (
      <>
        {Array.from(Array(count), () => <Icon name='Star' size='18px' />)}
      </>
    );
  };

  return (
    <ContextMenu.Menu navId='vz-addons-list-sort-filter-menu' onClose={onClose}>
      <ContextMenu.Group label='Sort'>
        <ContextMenu.RadioItem
          id='sort-name'
          group='sort'
          label='Name'
          checked={true}
          action={() => void 0}
        />
        <ContextMenu.RadioItem
          id='sort-top-rated'
          group='sort'
          label='Rating'
          action={() => void 0}
        />
        <ContextMenu.RadioItem
          id='sort-recently-added'
          group='sort'
          label='Published Date'
          action={() => void 0}
        />
        <ContextMenu.RadioItem
          id='sort-most-reviewed'
          group='sort'
          label='Review Count'
          action={() => void 0}
        />
        <ContextMenu.RadioItem
          id='sort-most-downloaded'
          group='sort'
          label='Installs'
          action={() => void 0}
        />
      </ContextMenu.Group>
      <ContextMenu.Group label='Filter'>
        <ContextMenu.CheckboxItem
          id='filter-enabled'
          label='Enabled'
          checked={true}
          action={() => void 0}
        />
        <ContextMenu.CheckboxItem
          id='filter-disabled'
          label='Disabled'
          checked={true}
          action={() => void 0}
        />
        <ContextMenu.CheckboxItem
          id='filter-five-star'
          label={() => Stars(5)}
          checked={true}
          action={() => void 0}
        />
        <ContextMenu.CheckboxItem
          id='filter-four-star'
          label={() => Stars(4)}
          checked={true}
          action={() => void 0}
        />
        <ContextMenu.CheckboxItem
          id='filter-three-star'
          label={() => Stars(3)}
          checked={true}
          action={() => void 0}
        />
        <ContextMenu.CheckboxItem
          id='filter-two-star'
          label={() => Stars(2)}
          checked={true}
          action={() => void 0}
        />
        <ContextMenu.CheckboxItem
          id='filter-one-star'
          label={() => Stars(1)}
          checked={true}
          action={() => void 0}
        />
      </ContextMenu.Group>
    </ContextMenu.Menu>
  );
});
