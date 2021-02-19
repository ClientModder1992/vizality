import React, { memo, useState, useEffect } from 'react';

import { joinClassNames } from '@vizality/util/dom';
import { getModule } from '@vizality/webpack';

import { TabBar, DeferredRender, Spinner } from '.';

export default memo(props => {
  const {
    preview,
    code,
    tabBarChildren,
    aside,
    selectedTab = 'preview',
    type = TabBar.Types.TOP_PILL
  } = props;

  const [ tab, setTab ] = useState(selectedTab);
  const { item } = getModule('topPill');

  useEffect(() => {
    if (!selectedTab || selectedTab === 'preview') setTab('preview');
    else if (selectedTab === 'code') setTab('code');
  }, [ selectedTab ]);

  const handleTabSelect = (tab) => {
    setTab(tab);
  };

  return (
    <div className='vz-component-preview' vz-tab={tab.toLowerCase()}>
      <div className='vz-component-preview-tabs-wrapper'>
        <div className='vz-component-preview-tabs-inner'>
          <TabBar
            selectedItem={tab}
            onItemSelect={handleTabSelect}
            type={type}
            className='vz-component-preview-tabs'
          >
            <TabBar.Item
              className={joinClassNames('vz-component-preview-tab-item', item)}
              selectedItem={tab}
              id='preview'
            >
              {/* <Tooltip text='Preview Component'>
                <Icon name='Science' width='20' height='20' />
              </Tooltip> */}
              Preview
            </TabBar.Item>
            <TabBar.Item
              className={joinClassNames('vz-component-preview-tab-item', item)}
              selectedItem={tab}
              id='code'
            >
              {/* <Tooltip text='Code'>
                <Icon name='InlineCode' width='20' height='20' />
              </Tooltip> */}
              Code
            </TabBar.Item>
          </TabBar>
          {tabBarChildren && <div className='vz-component-preview-tabs-children'>
            {tabBarChildren}
          </div>}
        </div>
      </div>
      <div className='vz-component-preview-inner'>
        <DeferredRender
          idleTimeout={10}
          fallback={
            <div className='vz-component-preview-content-loading'>
              <Spinner />
            </div>
          }
        >
          {aside && <div className='vz-component-preview-aside'>
            {aside}
          </div>}
          {tab === 'preview' && <>
            {preview && <div className='vz-component-preview-content' vz-tab='preview'>
              {preview}
            </div>}
          </>}
          {tab === 'code' && <>
            {code && <div className='vz-component-preview-content' vz-tab='code'>
              {code}
            </div>}
          </>}
        </DeferredRender>
      </div>
    </div>
  );
});
