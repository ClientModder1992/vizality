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
    <Item icon='Wrench' label='Settings' path='/settings' />
    {/* Installed, Discover, Ideas & Inspiration */}
    <Item icon='Plugin' label='Plugins' path='/plugins' />
    {/* Installed, Discover, Ideas & Inspiration */}
    <Item icon='Theme' label='Themes' path='/themes' />
    {/* CSS, JS, Custom CSS, Custom JS */}
    {vizality.manager.builtins.isEnabled('vz-snippet-manager') && <Item icon='Scissors' label='Snippets' path='/snippets' />}
    {vizality.manager.builtins.isEnabled('vz-quick-code') && <Item icon='Compose' label='Quick Code' path='/quick-code' />}
    <Item icon='Settings' label='Theme Editor' path='/form' disabled auxillaryIconTooltipText='Under Construction' />
    <Separator />
    {/* Addon Guidelines, Publish an Addon, Get Verified */}
    <Item icon='UnknownUser' label='Developers' path='/developers' />
    <Item icon='Science' label='Documentation' path='/documentation' expandable>
      <SubItem label='Getting Started' path='/documentation/getting-started' />
      <SubItem label='Plugins' path='/documentation/plugins' />
      <SubItem label='Themes' path='/documentation/themes' />
      <SubItem label='Screenshots' path='/documentation/components/screenshots' />
      <SubItem label='Components' path='/documentation/components/icons' />
      <SubItem label='Markdown' path='/documentation/components/markdown' />
      <SubItem label='Error Test' path='/documentation/components/error-test' />
      <SubItem label='Test' path='/documentation/components/test' />
    </Item>
    <Separator />
    <Item icon='CloudDownload' label='Updater' path='/updater' />
    <Item icon='ClockReverse' label='Changelog' path='/changelog'
      launch={() => vizality.api.actions.invoke('openLatestChangelog')}
      auxillaryIconTooltipText='Open Latest Update'
    />
  </AdvancedScrollerThin>
);
