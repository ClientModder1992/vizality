const { TabBar, Icon, SearchBar } = require('@vizality/components');
const { string: { toTitleCase } } = require('@vizality/util');
const { React } = require('@vizality/react');
const { getModule } = require('@vizality/webpack');
const { Messages } = require('@vizality/i18n');

const SortFilterMenu = require('./SortFilterMenu');
const OverflowMenu = require('./OverflowMenu');
const DisplayMenu = require('./DisplayMenu');
const TagsMenu = require('./TagsMenu');

module.exports = React.memo(props => {
  const { query, tab, display, handleTabChange, handleQueryChange, handleDisplayChange } = props;

  const PopoutDispatcher = getModule('openPopout');

  const formatDisplayIconName = (display) => {
    return `Layout${toTitleCase(display).replace(' ', '')}`;
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
    <>
      <div className='vz-addons-list-sticky-bar-wrapper'>
        <div className='vz-addons-list-sticky-bar'>
          <TabBar
            selectedItem={tab}
            onItemSelect={tab => handleTabChange(tab)}
            type={TabBar.Types.TOP_PILL}
          >
            <TabBar.Item selectedItem={tab} id='INSTALLED'>
              {Messages.VIZALITY_INSTALLED}
            </TabBar.Item>
            <TabBar.Item selectedItem={tab} id='DISCOVER'>
              {Messages.DISCOVER}
            </TabBar.Item>
            <TabBar.Item selectedItem={tab} id='SUGGESTIONS'>
              Suggestions
            </TabBar.Item>
          </TabBar>
          <div className='vz-addons-list-search-options'>
            <div className='vz-addons-list-search'>
              <SearchBar
                placeholder={Messages.SEARCH}
                query={query}
                onChange={search => handleQueryChange(search)}
                onClear={() => handleQueryChange('')}
              />
            </div>
            <div className='vz-addons-list-filter-button vz-addons-list-search-options-button'>
              <Icon
                tooltip={`Sort & Filter`}
                size='20'
                name='Filter2'
                onClick={e => renderSortFilterMenu(e)}
              />
            </div>
            <div className='vz-addons-list-tags-button vz-addons-list-search-options-button'>
              <Icon
                tooltip='Tags'
                name='StoreTag'
                onClick={e => renderTagsMenu(e)}
              />
            </div>
            <div className='vz-addons-list-display-button vz-addons-list-search-options-button'>
              <Icon
                tooltip='Display'
                name={formatDisplayIconName(display)}
                onClick={e => renderDisplayMenu(e)}
              />
            </div>
            <div className='vz-addons-list-more-button vz-addons-list-search-options-button'>
              <Icon
                tooltip={Messages.MORE}
                name='OverflowMenu'
                onClick={e => renderOverflowMenu(e)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
