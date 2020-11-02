/* eslint-disable no-use-before-define */
const { dom: { waitForElement }, react: { getOwnerInstance } } = require('@util');
const { getModule, contextMenu: { closeContextMenu } } = require('@webpack');
const { React, React: { useState } } = require('@react');

module.exports = React.memo(props => {
  let elements = {};

  const renderButton = (item, ctx) => {
    const { MenuItem } = getModule('MenuGroup');
    return (
      <MenuItem
        id={item.id || `item-${ctx.group}-${ctx.depth}-${ctx.i}`}
        disabled={item.disabled}
        label={item.name}
        color={item.color}
        hint={item.hint}
        subtext={item.subtext}
        action={() => {
          if (item.disabled) {
            waitForElement('#app-mount > div[class] > div').then(app => getOwnerInstance(app).shake(600, 5));
          } else if (item.onClick) {
            item.onClick();
          }
        }}
      />
    );
  };

  const renderCheckbox = (item, ctx) => {
    const { MenuCheckboxItem } = getModule('MenuGroup');
    const elementKey = `active-${ctx.group}-${ctx.depth}-${ctx.i}`;
    const isStandalone = !!ctx.standalone;
    const active = this.state[elementKey] !== void 0
      ? this.state[elementKey]
      : item.defaultState;

    return (
      <MenuCheckboxItem
        id={item.id || `item-${ctx.group}-${ctx.depth}-${ctx.i}`}
        checked={active}
        label={item.name}
        color={item.color}
        hint={item.hint}
        subtext={item.subtext}
        action={e => {
          const newActive = !active;
          if (item.onToggle) {
            item.onToggle(newActive);
          }
          if (isStandalone) {
            const el = e.target.closest('[role="menu"]');
            setImmediate(() => getOwnerInstance(el).forceUpdate());
          } else {
            this.setState({ [elementKey]: newActive });
          }
        }}
      />
    );
  };

  const renderSlider = (item, ctx) => {
    const { MenuControlItem } = getModule('MenuGroup');
    const Slider = getModule(m => m.render && m.render.toString().includes('sliderContainer'));
    return (
      <MenuControlItem
        id={item.id || `item-${ctx.group}-${ctx.depth}-${ctx.i}`}
        label={item.name}
        color={item.color}
        hint={item.hint}
        subtext={item.subtext}
        control={(props, ref) => <Slider
          mini
          ref={ref}
          equidistant={typeof item.markers !== 'undefined'}
          stickToMarkers={typeof item.markers !== 'undefined'}
          {...props}
          {...item}
        />}
      />
    );
  };

  const renderSubMenu = (item, ctx) => {
    const { MenuItem } = getModule('MenuGroup');
    const elementKey = `items-${ctx.group}-${ctx.depth}-${ctx.i}`;
    let items = this.state[elementKey];
    if (items === void 0) {
      items = item.getItems();
      this.setState({ [elementKey]: items });
      if (items instanceof Promise) {
        items.then(fetchedItems => this.setState({ [elementKey]: fetchedItems }));
      }
    }
    return (
      <MenuItem
        id={item.id || `item-${ctx.group}-${ctx.depth}-${ctx.i}`}
        disabled={!items || items instanceof Promise || items.length === 0 || item.disabled}
        label={item.name}
        color={item.color}
        hint={item.hint}
        subtext={item.subtext}
      >
        {items && !(items instanceof Promise) && items.length !== 0 && !item.disabled && renderItems(items, {
          depth: ctx.depth + 1,
          group: 0,
          i: 0
        })}
      </MenuItem>
    );
  };

  const renderItems = (items, ctx) => {
    return items.map(item => {
      ctx.i++;
      switch (item.type) {
        case 'button':
          return renderButton(item, ctx);
        case 'checkbox':
          return renderCheckbox(item, ctx);
        case 'slider':
          return renderSlider(item, ctx);
        case 'submenu':
          return renderSubMenu(item, ctx);
        default:
          return null;
      }
    });
  };

  const { default: Menu, MenuGroup } = getModule('MenuGroup');
  if (props.items) { // Just assume we're rendering just a simple part of a context menu
    return renderItems(props.items, {
      depth: 0,
      group: 0,
      i: 0
    });
  }

  return (
    <Menu
      navId={props.navId || `vz-${Math.random().toString(32).slice(2)}`}
      onClose={closeContextMenu}
    >
      {props.itemGroups.map((items, i) => (
        <MenuGroup>
          {renderItems(items, {
            depth: 0,
            group: i,
            i: 0
          })}
        </MenuGroup>
      ))}
    </Menu>
  );
});
