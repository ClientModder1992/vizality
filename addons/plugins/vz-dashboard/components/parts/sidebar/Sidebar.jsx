const { AdvancedScrollerThin } = require('@components');
const { joinClassNames } = require('@utilities');
const { getModule } = require('@webpack');
const { React } = require('@react');

const Item = require('./Item');

const Header = React.memo(({ children }) => {
  const { header } = getModule('header', 'item', 'separator');
  return (
    <h2 className={joinClassNames('vizality-dashboard-sidebar-header', header)}>{children}</h2>
  );
});

const Separator = React.memo(props =>
  <div className='vizality-dashboard-sidebar-separator' {...props}></div>
);

const SubItem = React.memo(({ label, path, action, launch }) =>
  <Item label={label} path={path} action={action} launch={launch} subItem />
);

module.exports = React.memo(() =>
  <AdvancedScrollerThin className='vizality-dashboard-sidebar'>
    <Header>Vizality Dashboard</Header>
    <Item icon='Home' label='Home' path='/home' />
    <Item icon='Gear' label='Settings' path='/settings' />
    {/* Installed, Discover, Ideas & Inspiration */}
    <Item icon='Plugin' label='Plugins' path='/plugins' />
    {/* Installed, Discover, Ideas & Inspiration */}
    <Item icon='Theme' label='Themes' path='/themes' />
    {/* CSS, JS, Custom CSS, Custom JS */}
    <Item icon='InlineCode' label='Snippets' path='/snippets' />
    <Item icon='Editor' label='Theme Editor' path='/form' />
    <Separator />
    {/* Addon Guidelines, Publish an Addon, Get Verified */}
    <Item icon='UnknownUser' label='Developers' path='/developers' />
    <Item icon='Science' label='Documentation' path='/documentation' expandable>
      <SubItem label='Getting Started' path='/documentation/getting-started' />
      <SubItem label='Plugins' path='/documentation/plugins' />
      <SubItem label='Themes' path='/documentation/themes' />
      <SubItem label='Testing' path='/documentation/components/test' />
      <SubItem label='Screenshots' path='/documentation/components/screenshots' />
      <SubItem label='Components' path='/documentation/components/icons' />
      <SubItem label='Components' path='/documentation/components/test' />
    </Item>
    <Item icon='Experiment' label='Experiments' path='/experiments' />
    <Separator />
    <Item icon='CloudDownload' label='Updates' path='/updates' />
    <Item icon='History' label='Changelog' path='/changelog'
      launch={`vizality.api.actions.run('openLatestChangelog')`}
      auxillaryIconTooltipText='Open Latest Log'
    />
  </AdvancedScrollerThin>
);
