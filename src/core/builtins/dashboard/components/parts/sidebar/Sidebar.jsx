import React, { memo } from 'react';

import { AdvancedScrollerThin } from '@vizality/components';
import { joinClassNames } from '@vizality/util/dom';
import { getModule } from '@vizality/webpack';

import Item from './Item';

const Header = memo(({ children }) => {
  const { discoverHeader } = getModule('discoverHeader');
  const { size24 } = getModule('size24');
  const { base } = getModule('base');
  return (
    <h2 className={joinClassNames(discoverHeader, base, size24)}>
      {children}
    </h2>
  );
});

const Separator = memo(props =>
  <div className='vz-dashboard-sidebar-separator' {...props}></div>
);

const SubItem = memo(({ label, path, action, launch }) =>
  <Item label={label} path={path} action={action} launch={launch} subItem />
);

export default memo(() =>
  <AdvancedScrollerThin className='vz-dashboard-sidebar'>
    <Header>Dashboard</Header>
    <Item icon='Home' label='Home' path='/home' />
    <Item icon='Gear' label='Settings' path='/settings' />
    <Item icon='Plugin' label='Plugins' path='/plugins' />
    <Item icon='Theme' label='Themes' path='/themes' />
    {vizality.manager.builtins.isEnabled('quick-code') && <Item icon='Compose' label='Quick Code' path='/quick-code' />}
    <Item icon='Settings' label='Theme Editor' path='/theme-editor' disabled auxillaryIconTooltipText='Under Construction' />
    <Separator />
    {/* Addon Guidelines, Publish an Addon, Get Verified, Documentation */}
    <Item icon='UnknownUser' disabled label='Developers' path='/developers' />
    <Item icon='Science' label='Documentation' path='/docs' expandable>
      <SubItem label='Getting Started' path='/docs/getting-started' />
      <SubItem label='Plugins' path='/docs/plugins' />
      <SubItem label='Themes' path='/docs/themes' />
      <SubItem label='Screenshots' path='/docs/components/screenshots' />
      <SubItem label='Components' path='/docs/components/icons' />
      <SubItem label='Markdown' path='/docs/components/markdown' />
      <SubItem label='Error Test' path='/docs/components/error-test' />
      <SubItem label='Test' path='/docs/components/test' />
      <SubItem label='Test2' path='/docs/components/test2' />
    </Item>
    <Separator />
    <Item icon='CloudDownload' label='Updater' path='/updater' />
    <Item icon='ClockReverse' label='Changelog' path='/changelog'
      launch={() => vizality.api.actions.invokeAction('OPEN_LATEST_CHANGELOG')}
      auxillaryIconTooltipText='Open Latest Update'
    />
  </AdvancedScrollerThin>
);
