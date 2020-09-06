const { React, React: { useState, useEffect } } = require('@react');
const { joinClassNames } = require('@util');
const { getModule, getModuleByDisplayName } = require('@webpack');

const TabBar = getModuleByDisplayName('TabBar');

module.exports = React.memo(({ previewTabContent = 'pie', codeTabContent = 'poop', tabChildren, selectedTab = 'PREVIEW' }) => {
  const [ tab, setTab ] = useState(selectedTab);

  const { topPill, item } = getModule('topPill');

  useEffect(() => {
    if (!selectedTab || selectedTab === 'PREVIEW') setTab('PREVIEW');
    else if (selectedTab === 'CODE') setTab('CODE');
  }, [ selectedTab ]);

  return (
    <>
      <div className='vizality-entities-manage-tabs'>
        <TabBar
          selectedItem={tab}
          onItemSelect={tab => setTab(tab)}
          type={topPill}
        >
          <TabBar.Item className={item} selectedItem={tab} id='PREVIEW'>
            Preview
          </TabBar.Item>
          <TabBar.Item className={item} selectedItem={tab} id='CODE'>
            Code
          </TabBar.Item>
          {tabChildren}
        </TabBar>
      </div>
      <div className={joinClassNames(`poop-div ${tab.toLowerCase()}`)}>
        {tab === 'PREVIEW' && <>
          {previewTabContent}
        </>}
        {tab === 'CODE' && <>
          {codeTabContent}
        </>}
      </div>
    </>
  );
});
