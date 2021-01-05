import React, { memo, useState, useEffect } from 'react';

import { joinClassNames } from '@vizality/util/dom';
import { getModule } from '@vizality/webpack';

import { TabBar, DeferredRender, Spinner } from '.';

export default memo(props => {
  const {
    previewTabChildren,
    codeTabChildren,
    tabChildren,
    aside,
    selectedTab = 'PREVIEW',
    type = TabBar.Types.TOP_PILL
  } = props;

  const [ tab, setTab ] = useState(selectedTab);
  const { item } = getModule('topPill');

  useEffect(() => {
    if (!selectedTab || selectedTab === 'PREVIEW') setTab('PREVIEW');
    else if (selectedTab === 'CODE') setTab('CODE');
  }, [ selectedTab ]);

  return (
    <div className={joinClassNames('vz-component-preview', `vz-is-active-${tab.toLowerCase()}`)}>
      <div className='vz-component-preview-tabs-wrapper'>
        <div className='vz-component-preview-tabs-inner'>
          <TabBar
            selectedItem={tab}
            onItemSelect={tab => setTab(tab)}
            type={type}
            className='vz-component-preview-tabs'
          >
            <TabBar.Item
              className={joinClassNames('vz-component-preview-tabs-item', item, { 'vz-is-active': tab === 'PREVIEW' })}
              selectedItem={tab}
              id='PREVIEW'
            >
              {/* <Tooltip text='Preview Component'>
                <Icon name='Science' width='20' height='20' />
              </Tooltip> */}
              Preview
            </TabBar.Item>
            <TabBar.Item
              className={joinClassNames('vz-component-preview-tabs-item', item, { 'vz-is-active': tab === 'CODE' })}
              selectedItem={tab}
              id='CODE'
            >
              {/* <Tooltip text='Code'>
                <Icon name='InlineCode' width='20' height='20' />
              </Tooltip> */}
              Code
            </TabBar.Item>
          </TabBar>
          {tabChildren && <div className='vz-component-preview-tab-children'>
            {tabChildren}
          </div>}
        </div>
      </div>
      <div className='vz-component-preview-inner'>
        {aside && <div className='vz-component-preview-aside'>
          {aside}
        </div>}
        {tab === 'PREVIEW' && <>
          {previewTabChildren && <div className='vz-component-preview-content'>
            <DeferredRender fallback={
              <div className='vz-component-preview-content-loading'>
                <Spinner />
              </div>
            }>
              {previewTabChildren}
            </DeferredRender>
          </div>}
        </>}
        {tab === 'CODE' && <>
          {codeTabChildren && <div className='vz-component-preview-content'>
            {codeTabChildren}
          </div>}
        </>}
      </div>
    </div>
  );
});
