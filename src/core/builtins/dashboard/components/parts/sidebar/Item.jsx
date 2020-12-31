import React, { memo } from 'react';

import { Clickable, Icon, Tooltip, Menu } from '@vizality/components';
import { getModule, contextMenu } from '@vizality/webpack';
import { joinClassNames } from '@vizality/util';

const { closeContextMenu, openContextMenu } = contextMenu;

export default memo(({ icon, label, path, action, launch, expandable, subItem, disabled, auxillaryIconTooltipText, children }) => {
  const { useLocation } = getModule('useLocation');
  const { categoryItem, selectedCategoryItem, itemInner } = getModule('discoverHeader');
  const { container, selected: selectedClass, clickable, wrappedLayout, layout, avatar, content } = getModule('wrappedLayout');

  const location = useLocation();
  const fullPath = `/vizality/dashboard${path}`;
  const selected = location.pathname.startsWith(fullPath);
  const isSubItemSelected = selected && location.pathname !== fullPath;

  return (
    <>
      <Clickable
        onContextMenu={e => openContextMenu(e, () =>
          <Menu.Menu navId='dashboard-item' onClose={closeContextMenu}>
            <Menu.MenuItem
              id='copy-link'
              label='Copy Link'
              action={() => DiscordNative.clipboard.copy(`<vizality:/${path}>`)}
            />
          </Menu.Menu>
        )}
        onClick={(e) => {
          if (disabled) return;
          // @todo Make this... not so bad.
          // eslint-disable-next-line consistent-this
          const _this = e.target.closest('.vz-dashboard-sidebar-item');
          if (_this &&
            (e.target === _this.querySelector('.vz-dashboard-sidebar-auxillary-icon') ||
            _this.querySelector('.vz-dashboard-sidebar-auxillary-icon') &&
            _this.querySelector('.vz-dashboard-sidebar-auxillary-icon').contains(e.target))) {
            return;
          }

          if (path) {
            if (action) {
              vizality.api.router.navigate(fullPath);
              return eval(action);
            }
            vizality.api.router.navigate(fullPath);
          } else {
            if (action) {
              return eval(action);
            }
          }
        }}
        className={joinClassNames({
          expandable,
          disabled,
          expanded: isSubItemSelected && !subItem && expandable,
          'vz-dashboard-sidebar-item': !subItem,
          'vz-dashboard-sidebar-subitem': subItem,
          'subitem-is-selected': isSubItemSelected,
          [`${selectedCategoryItem} ${selectedClass}`]: (selected && !isSubItemSelected) || (selected && isSubItemSelected && subItem) || (selected && isSubItemSelected && !expandable),
          [`${clickable}`]: !selected || isSubItemSelected
        },
        container,
        categoryItem
        )}
      >
        <div className={joinClassNames({
          'vz-dashboard-sidebar-item-inner': !subItem,
          'vz-dashboard-sidebar-subitem-inner': subItem
        },
        layout,
        wrappedLayout,
        itemInner
        )}>
          {icon && <div className={`vz-dashboard-sidebar-item-icon-wrapper ${avatar}`}>
            {icon === 'Scissors'
              /*
               * Just a small adjustment to make the Scissors icon appear about the same size
               * as the other icons.
               */
              ? <Icon name='Scissors' width='22' height='22' />
              : <Icon name={icon} />}
          </div>}
          <div className={content}>{label}</div>
          {expandable && <Clickable
            className='vz-dashboard-sidebar-auxillary-icon-wrapper vz-dashboard-sidebar-collapser'
            onClick={(e) => e.target.closest('.vz-dashboard-sidebar-item').classList.toggle('expanded')}
          >
            <Icon name='RightCaret' width='18' height='18' className='vz-dashboard-sidebar-auxillary-icon' />
          </Clickable>}
          {launch && <Tooltip
            text={auxillaryIconTooltipText || 'Open'}
            className='vz-dashboard-sidebar-auxillary-icon-wrapper vz-dashboard-sidebar-launcher'
          >
            <Clickable onClick={launch}>
              <Icon name='Launch' width={18} height={18} className='vz-dashboard-sidebar-auxillary-icon' />
            </Clickable>
          </Tooltip>}
          {disabled && <Tooltip
            text={auxillaryIconTooltipText}
            className='vz-dashboard-sidebar-auxillary-icon-wrapper vz-dashboard-sidebar-warning'
          >
            {/* <Icon name='WarningCircle' width={18} height={18} className='vz-dashboard-sidebar-auxillary-icon' /> */}
          </Tooltip>}
        </div>
      </Clickable>
      {expandable && children && <div className='vz-dashboard-sidebar-subitems'>
        {children}
      </div>}
    </>
  );
});
