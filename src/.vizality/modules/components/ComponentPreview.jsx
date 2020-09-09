const { React, React: { useState, useEffect } } = require('@react');
const { getModule, getModuleByDisplayName } = require('@webpack');
const { joinClassNames } = require('@util');

const Icon = require('./Icon');
const Tooltip = (() => getModule('TooltipContainer').TooltipContainer)();
const TabBar = getModuleByDisplayName('TabBar');

module.exports = React.memo(({ previewTabChildren, codeTabChildren, tabsChildren, asideChildren, selectedTab = 'PREVIEW' }) => {
  const [ tab, setTab ] = useState(selectedTab);
  const { topPill, item } = getModule('topPill');

  useEffect(() => {
    if (!selectedTab || selectedTab === 'PREVIEW') setTab('PREVIEW');
    else if (selectedTab === 'CODE') setTab('CODE');
  }, [ selectedTab ]);

  console.log('test');

  return (
    <div className='vz-component-preview'>
      <div className='vz-component-preview-tabs'>
        <TabBar
          selectedItem={tab}
          onItemSelect={tab => setTab(tab)}
          type={topPill}
          className='vz-component-preview-tabs-inner-wrapper'
        >
          <TabBar.Item className={joinClassNames('vz-component-preview-tabs-item', item)} selectedItem={tab} id='PREVIEW'>
            {/* <Tooltip text='Preview Component'>
              <Icon name='Science' width='20' height='20' />
            </Tooltip> */}
            Preview
          </TabBar.Item>
          <TabBar.Item className={joinClassNames('vz-component-preview-tabs-item', item)} selectedItem={tab} id='CODE'>
            {/* <Tooltip text='Code'>
              <Icon name='InlineCode' width='20' height='20' />
            </Tooltip> */}
            Code
          </TabBar.Item>
          {tabsChildren}
        </TabBar>
      </div>
      <div className={joinClassNames('vz-component-preview-inner-wrapper', `vz-selected-tab-is-${tab.toLowerCase()}`)}>
        {tab === 'PREVIEW' && <>
          {asideChildren && <div className='vz-component-preview-aside'>
            {asideChildren}
          </div>}
          {previewTabChildren && <div className='vz-component-preview-content'>
            {previewTabChildren}
          </div>}
        </>}
        {tab === 'CODE' && <>
          {asideChildren && <div className='vz-component-preview-aside'>
            {asideChildren}
          </div>}
          {codeTabChildren && <div className='vz-component-preview-content'>
            {codeTabChildren}
          </div>}
        </>}
      </div>
    </div>
  );
});
