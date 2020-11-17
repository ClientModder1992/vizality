/* eslint-disable no-use-before-define *//* eslint-disable no-unused-vars */
const { shell } = require('electron');

const { settings: { TextInput }, ContextMenu, Divider, Icon, TabBar, Confirm, Card } = require('@vizality/components');
const { getModule, getModuleByDisplayName, contextMenu } = require('@vizality/webpack');
const { open: openModal, close: closeModal } = require('@vizality/modal');
const { string: { toHeaderCase, toPlural } } = require('@vizality/util');
const { React, React: { useState, useCallback } } = require('@vizality/react');
const { Messages } = require('@vizality/i18n');

const Addon = require('../addon/Addon');

module.exports = React.memo(({ type, tab, search }) => {
  const [ currentTab, setCurrentTab ] = useState(tab || 'installed');
  const [ searchText, setSearchText ] = useState(search || '');
  const [ , updateState ] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  const { colorStandard } = getModule('colorStandard');

  // const renderSearch = () => {
  //   return (
  //     <div className='vizality-entities-manage-search'>
  //       {/* @todo: Figure out how to use SearchBar component instead */}
  //       <TextInput
  //         value={searchText}
  //         onChange={search => setSearchText(search)}
  //         placeholder={Messages.VIZALITY_ADDONS_FILTER_PLACEHOLDER}
  //       >
  //         {Messages.VIZALITY_ADDONS_FILTER.format({ type })}
  //       </TextInput>
  //     </div>
  //   );
  // };

  const renderItem = item => {
    return (
      <Addon
        manifest={item.manifest}
        addonId={item.entityID}
        isEnabled={vizality.manager[toPlural(type)].isEnabled(item.entityID)}
        onToggle={async v => _toggle(item.entityID, v)}
        onUninstall={() => _uninstall(item.entityID)}
      />
    );
  };

  const renderButtons = () => {
    return (
      <div className='vz-addons-list-more-button'>
        <Icon name='OverflowMenu'
          onClick={e => openOverflowMenu(e)}
          onContextMenu={e => openOverflowMenu(e)}
        />
      </div>
    );
  };

  const fetchMissing = async type => {
    vizality.api.notices.closeToast('vz-addon-manager-fetch-entities');

    const missingAddons = vizality.manager[toPlural(type)].start(true);
    const missingAddonsList = missingAddons.length
      ? React.createElement('div', null,
        Messages.VIZALITY_MISSING_ADDONS_RETRIEVED.format({ entity: type, count: missingAddons.length }),
        React.createElement('ul', null, missingAddons.map(entity =>
          React.createElement('li', null, `– ${entity}`))
        )
      )
      : Messages.VIZALITY_MISSING_ADDONS_NONE;

    vizality.api.notices.sendToast('vz-addon-manager-fetch-entities', {
      header: Messages.VIZALITY_MISSING_ADDONS_FOUND.format({ type, count: missingAddons.length }),
      content: missingAddonsList,
      type: missingAddons.length > 0 && 'success',
      icon: type,
      timeout: 5e3,
      buttons: [
        {
          text: 'Got it',
          look: 'ghost'
        }
      ]
    });
  };

  const openOverflowMenu = (e) => {
    contextMenu.openContextMenu(e, () =>
      React.createElement(ContextMenu, {
        width: '50px',
        itemGroups: [ [
          {
            type: 'button',
            name: Messages.VIZALITY_ADDONS_OPEN_FOLDER.format({ type: toHeaderCase(type) }),
            onClick: () => {
              shell.openItem(eval(`${toPlural(type).toUpperCase()}_FOLDER`));
            }
          },
          {
            type: 'button',
            name: Messages.VIZALITY_ADDONS_LOAD_MISSING.format({ type: toHeaderCase(type) }),
            onClick: () => fetchMissing(type)
          }
        ] ]
      })
    );
  };

  const _sortItems = items => {
    if (searchText && searchText !== '') {
      const search = searchText.toLowerCase();
      items = items.filter(p =>
        p.manifest.name.toLowerCase().includes(search) ||
        p.manifest.author.toLowerCase().includes(search) ||
        p.manifest.description.toLowerCase().includes(search)
      );
    }

    return items.sort((a, b) => {
      const nameA = a.manifest.name.toLowerCase();
      const nameB = b.manifest.name.toLowerCase();

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      return 0;
    });
  };

  const getItems = () => {
    return _sortItems([ ...vizality.manager[toPlural(type)].values ]);
  };

  const renderPlaceholders = () => {
    const placeholders = [];
    for (let i = 0; i < 8; i++) {
      placeholders.push(<Card className='vz-addon-card vz-addon-card-placeholder' />);
    }

    return placeholders;
  };

  const renderBody = () => {
    const items = getItems();
    return (
      <div className='vz-addons-list-items'>
        {/* {renderSearch()} */}
        {items.length === 0
          ? <div className='vz-addons-list-empty'>
            <div className={getModule('emptyStateImage', 'emptyStateSubtext').emptyStateImage}/>
            <p>{Messages.GIFT_CONFIRMATION_HEADER_FAIL}</p>
            <p>{Messages.SEARCH_NO_RESULTS}</p>
          </div>
          : <>
            {items.map(item => renderItem(item))}
            {renderPlaceholders()}
          </>}
      </div>
    );
  };

  const renderStickyBar = () => {
    const { item } = getModule('item', 'topPill');
    const { Types } = getModuleByDisplayName('TabBar');
    return (
      <>
        <div className='vz-addons-list-sticky-bar'>
          <div className='vz-addons-list-sticky-bar-inner'>
            <TabBar
              selectedItem={currentTab}
              onItemSelect={tab => setCurrentTab(tab)}
              type={Types.TOP_PILL}
            >
              <TabBar.Item className={item} selectedItem={currentTab} id='installed'>
                {Messages.VIZALITY_INSTALLED}
              </TabBar.Item>
              <TabBar.Item className={item} selectedItem={currentTab} id='discover'>
                {Messages.DISCOVER}
              </TabBar.Item>
            </TabBar>
            {renderButtons()}
          </div>
        </div>
      </>
    );
  };

  const _toggle = async (addonId, enabled) => {
    let fn;
    let addons;
    if (enabled) {
      addons = [ addonId ].concat(vizality.manager[toPlural(type)].get(addonId).dependencies);
      fn = vizality.manager[toPlural(type)].enable.bind(vizality.manager[toPlural(type)]);
    } else {
      addons = [ addonId ].concat(vizality.manager[toPlural(type)].get(addonId).dependents);
      fn = vizality.manager[toPlural(type)].disable.bind(vizality.manager[toPlural(type)]);
    }

    const apply = async () => {
      for (const addon of addons) {
        await fn(addon);
        forceUpdate();
      }
    };

    if (addons.length === 1) {
      return apply();
    }

    const title = enabled
      ? Messages.VIZALITY_ADDONS_ENABLE.format({ type })
      : Messages.VIZALITY_ADDONS_DISABLE.format({ type });
    const note = enabled
      ? Messages.VIZALITY_ADDONS_ENABLE_NOTE.format({ type })
      : Messages.VIZALITY_ADDONS_DISABLE_NOTE.format({ type });
    openModal(() => (
      <Confirm
        red={!enabled}
        header={title}
        confirmText={title}
        cancelText={Messages.CANCEL}
        onConfirm={async () => {
          await apply();
          forceUpdate();
          closeModal();
        }}
        onCancel={closeModal}
      >
        <div className='vizality-entity-modal'>
          <span>{note}</span>
          <ul>
            {addons.map(p => <li key={p.id}>{vizality.manager[toPlural(type)].get(p).manifest.name}</li>)}
          </ul>
        </div>
      </Confirm>
    ));
  };

  const _uninstall = (addonId) => {
    const addons = [ addonId ].concat(vizality.manager[toPlural(type)].get(addonId).dependents);
    openModal(() => (
      <Confirm
        red
        header={Messages.VIZALITY_ADDONS_UNINSTALL.format({ type, count: addons.length })}
        confirmText={Messages.VIZALITY_ADDONS_UNINSTALL.format({ type, count: addons.length })}
        cancelText={Messages.CANCEL}
        onCancel={closeModal}
        onConfirm={async () => {
          for (const addon of addons) {
            await vizality.manager[toPlural(type)].uninstall(addon);
          }
          forceUpdate();
          closeModal();
        }}
      >
        <div className='vizality-entity-modal'>
          <span>{Messages.VIZALITY_ADDONS_UNINSTALL_SURE.format({ type, count: addons.length })}</span>
          <ul>
            {addons.map(p => <li key={p.id}>{vizality.manager[toPlural(type)].get(p).manifest.name}</li>)}
          </ul>
        </div>
      </Confirm>
    ));
  };

  const renderHeader = () => {
    return (
      <>
        <div className='vz-addons-list-active-filters' {...{ [type]: true }}>
          <span>{Messages[`VIZALITY_ADDONS_${currentTab.toUpperCase()}`].format({ type: toHeaderCase(type) })}</span>
        </div>
        <Divider/>
      </>
    );
  };

  return (
    <>
      <div className={`vz-addons-list ${colorStandard}`}>
        {renderStickyBar()}
        <div className='vz-addons-list-inner'>
          {renderHeader()}
          {renderBody()}
        </div>
      </div>
    </>
  );
});
