import React, { memo, useState } from 'react';

import { StickyWrapper, TabBar, Icon, SearchBar } from '@vizality/components';
import { toTitleCase } from '@vizality/util/string';
import { getModule } from '@vizality/webpack';
import { Messages } from '@vizality/i18n';

import SortFilterMenu from './SortFilterMenu';
import OverflowMenu from './OverflowMenu';
import DisplayMenu from './DisplayMenu';
import TagsMenu from './TagsMenu';

export default memo(props => {
  const { query, tab, display, handleTabChange, handleQueryChange, handleDisplayChange } = props;
  const [ sticky, setSticky ] = useState(null);
  const PopoutDispatcher = getModule('openPopout');

  const formatDisplayIconName = display => {
    return `Layout${toTitleCase(display).replace(' ', '')}`;
  };

  const _handleStickyChange = (status) => {
    setSticky(status);
  };

  const popoutConfig = {
    animationType: 0,
    closeOnScroll: false,
    shadow: false,
    position: 'bottom'
  };

  const renderSortFilterMenu = e => {
    PopoutDispatcher.openPopout(e.target, {
      'vz-popout': 'vz-addons-list-sort-filter-menu',
      render: ({ onClose }) => <SortFilterMenu onClose={onClose} {...props} />,
      ...popoutConfig
    }, 'vz-addons-list-sort-filter-menu');
  };

  const renderTagsMenu = e => {
    PopoutDispatcher.openPopout(e.target, {
      'vz-popout': 'vz-addons-list-tags-menu',
      render: ({ onClose }) => <TagsMenu onClose={onClose} {...props} />,
      ...popoutConfig
    }, 'vz-addons-list-tags-menu');
  };

  const renderDisplayMenu = e => {
    PopoutDispatcher.openPopout(e.target, {
      'vz-popout': 'vz-addons-list-display-menu',
      render: ({ onClose }) => <DisplayMenu onClose={onClose} handleDisplayChange={handleDisplayChange} {...props} />,
      ...popoutConfig
    }, 'vz-addons-list-display-menu');
  };

  const renderOverflowMenu = e => {
    PopoutDispatcher.openPopout(e.target, {
      'vz-popout': 'vz-addons-list-overflow-menu',
      render: ({ onClose }) => <OverflowMenu onClose={onClose} display={display} {...props} />,
      ...popoutConfig
    }, 'vz-addons-list-overflow-menu');
  };

  return (
    <StickyWrapper
      handleStickyChange={_handleStickyChange}
      wrapperClassName='vz-addons-list-sticky-bar-wrapper'
      className='vz-addons-list-sticky-bar'
    >
      <TabBar
        selectedItem={tab}
        onItemSelect={handleTabChange}
        type={TabBar.Types.TOP_PILL}
      >
        <TabBar.Item selectedItem={tab} id='installed'>
          {Messages.VIZALITY_INSTALLED}
        </TabBar.Item>
        <TabBar.Item selectedItem={tab} id='discover'>
          {Messages.DISCOVER}
        </TabBar.Item>
        <TabBar.Item selectedItem={tab} id='browse'>
          Browse
        </TabBar.Item>
      </TabBar>
      <div className='vz-addons-list-search-options'>
        <div className='vz-addons-list-search'>
          <SearchBar
            placeholder={Messages.SEARCH}
            query={query}
            onChange={handleQueryChange}
            onClear={() => handleQueryChange('')}
          />
        </div>
        <div className='vz-addons-list-filter-button vz-addons-list-search-options-button'>
          <Icon
            tooltip={`Sort & Filter`}
            size='20'
            tooltipPosition={sticky === 'stuck' ? 'bottom' : 'top'}
            name='FilterAlt'
            onClick={renderSortFilterMenu}
          />
        </div>
        <div className='vz-addons-list-tags-button vz-addons-list-search-options-button'>
          <Icon
            tooltip='Tags'
            name='StoreTag'
            tooltipPosition={sticky === 'stuck' ? 'bottom' : 'top'}
            onClick={renderTagsMenu}
          />
        </div>
        <div className='vz-addons-list-display-button vz-addons-list-search-options-button'>
          <Icon
            tooltip='Display'
            tooltipPosition={sticky === 'stuck' ? 'bottom' : 'top'}
            name={formatDisplayIconName(display)}
            onClick={renderDisplayMenu}
          />
        </div>
        <div className='vz-addons-list-more-button vz-addons-list-search-options-button'>
          <Icon
            tooltip={Messages.MORE}
            tooltipPosition={sticky === 'stuck' ? 'bottom' : 'top'}
            name='OverflowMenu'
            onClick={renderOverflowMenu}
          />
        </div>
      </div>
    </StickyWrapper>
  );
});
