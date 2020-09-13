const { Clickable, Icon, Tooltip } = require('@components');
const { joinClassNames } = require('@util');
const { getModule } = require('@webpack');
const { React } = require('@react');

module.exports = React.memo(({ icon, label, path, action, launch, expandable, subItem, disabled, auxillaryIconTooltipText, children }) => {
  const { useLocation } = getModule('useLocation');
  const { categoryItem, selectedCategoryItem, itemInner } = getModule('discoverHeader');
  const { container, selected: selectedClass, clickable, wrappedLayout, layout, avatar, content } = getModule('wrappedLayout');

  const loc = useLocation();
  const fullPath = `/vizality/dashboard${path}`;
  const selected = loc.pathname.startsWith(fullPath);
  const isSubItemSelected = selected && loc.pathname !== fullPath;

  return (
    <>
      <Clickable
        onClick={(e) => {
          if (disabled) return;
          // eslint-disable-next-line consistent-this
          const _this = e.target.closest('.vizality-dashboard-sidebar-item');
          if (_this &&
            (e.target === _this.querySelector('.vizality-dashboard-sidebar-auxillary-icon') ||
            _this.querySelector('.vizality-dashboard-sidebar-auxillary-icon') &&
            _this.querySelector('.vizality-dashboard-sidebar-auxillary-icon').contains(e.target))) {
            return;
          }

          if (path) {
            if (action) {
              vizality.api.router.navigate(`/dashboard${path}`);
              return eval(action);
            }
            vizality.api.router.navigate(`/dashboard${path}`);
          } else {
            if (action) {
              return eval(action);
            }
          }
        }}
        className={joinClassNames({
          expandable,
          disabled,
          expanded: isSubItemSelected && !subItem,
          'vizality-dashboard-sidebar-item': !subItem,
          'vizality-dashboard-sidebar-subitem': subItem,
          'subitem-is-selected': isSubItemSelected,
          [`${selectedCategoryItem} ${selectedClass}`]: (selected && !isSubItemSelected) || (selected && isSubItemSelected && subItem),
          [`${clickable}`]: !selected || isSubItemSelected
        },
        container,
        categoryItem
        )}
      >
        <div className={joinClassNames({
          'vizality-dashboard-sidebar-item-inner': !subItem,
          'vizality-dashboard-sidebar-subitem-inner': subItem
        },
        layout,
        wrappedLayout,
        itemInner
        )}>
          {icon && <div className={`vizality-dashboard-sidebar-item-icon-wrapper ${avatar}`}>
            {icon === 'Scissors'
              ? <Icon name='Scissors' width='22' height='22' />
              : <Icon name={icon} />}
          </div>}
          <div className={content}>{label}</div>
          {expandable && <Clickable
            className='vizality-dashboard-sidebar-auxillary-icon-wrapper vizality-dashboard-sidebar-collapser'
            onClick={(e) => e.target.closest('.vizality-dashboard-sidebar-item').classList.toggle('expanded')}
          >
            <Icon name='Caret' className='vizality-dashboard-sidebar-auxillary-icon' />
          </Clickable>}
          {launch && <Tooltip
            text={auxillaryIconTooltipText || 'Open'}
            className='vizality-dashboard-sidebar-auxillary-icon-wrapper vizality-dashboard-sidebar-launcher'
          >
            <Clickable onClick={() => eval(launch)}>
              <Icon name='Launch' width={18} height={18} className='vizality-dashboard-sidebar-auxillary-icon' />
            </Clickable>
          </Tooltip>}
          {disabled && <Tooltip
            text={auxillaryIconTooltipText}
            className='vizality-dashboard-sidebar-auxillary-icon-wrapper vizality-dashboard-sidebar-warning'
          >
            <Icon name='WarningCircle' width={18} height={18} className='vizality-dashboard-sidebar-auxillary-icon' />
          </Tooltip>}
        </div>
      </Clickable>
      {expandable && children && <div className='vizality-dashboard-sidebar-subitems'>
        {children}
      </div>}
    </>
  );
});
