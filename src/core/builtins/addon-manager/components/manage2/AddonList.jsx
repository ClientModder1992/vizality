/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
const { shell } = require('electron');

const { settings: { TextInput }, ContextMenu, Divider, Icon, TabBar, Confirm } = require('@vizality/components');
const { getModule, getModuleByDisplayName, contextMenu } = require('@vizality/webpack');
const { open: openModal, close: closeModal } = require('@vizality/modal');
const { string: { toHeaderCase, toPlural } } = require('@vizality/util');
const { React, React: { useState } } = require('@vizality/react');
const { Messages } = require('@vizality/i18n');

const AddonList = require('./AddonList');
const BaseProduct = require('../parts/BaseProduct');

module.exports = React.memo(({ type, tab, search }) => {
  const [ currentTab, setCurrentTab ] = useState(tab || 'INSTALLED');
  const [ searchText, setSearchText ] = useState(search || '');
  const { colorStandard } = getModule('colorStandard');

  const renderSearch = () => {
    return (
      <div className='vizality-entities-manage-search'>
        {/* @todo: Figure out how to use SearchBar component instead */}
        <TextInput
          value={searchText}
          onChange={search => setSearchText(search)}
          placeholder={Messages.VIZALITY_ENTITIES_FILTER_PLACEHOLDER}
        >
          {Messages.VIZALITY_ENTITIES_FILTER.format({ entityType: type })}
        </TextInput>
      </div>
    );
  };

  const renderItem = item => {
    return (
      <BaseProduct
        product={item.manifest}
        isEnabled={vizality.manager.plugins.isEnabled(item.entityID)}
        onToggle={async v => _toggle(item.entityID, v)}
        onUninstall={() => _uninstall(item.entityID)}
      />
    );
  };

  const renderButtons = () => {
    return (
      <div className='vizality-entities-manage-buttons'>
        <Icon name='OverflowMenu'
          onClick={e => openOverflowMenu(e)}
          onContextMenu={e => openOverflowMenu(e)}
        />
      </div>
    );
  };

  const fetchMissing = async type => {
    vizality.api.notices.closeToast('vz-addon-manager-fetch-entities');

    const missingEntities = vizality.manager[toPlural(type)].start(true);
    const missingEntitiesList = missingEntities.length
      ? React.createElement('div', null,
        Messages.VIZALITY_MISSING_ENTITIES_RETRIEVED.format({ entity: type, count: missingEntities.length }),
        React.createElement('ul', null, missingEntities.map(entity =>
          React.createElement('li', null, `– ${entity}`))
        )
      )
      : Messages.VIZALITY_MISSING_ENTITIES_NONE;

    vizality.api.notices.sendToast('vz-addon-manager-fetch-entities', {
      header: Messages.VIZALITY_MISSING_ENTITIES_FOUND.format({ entity: type, count: missingEntities.length }),
      content: missingEntitiesList,
      type: missingEntities.length > 0 && 'success',
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
            name: Messages.VIZALITY_ENTITIES_OPEN_FOLDER.format({ entityType: toHeaderCase(type) }),
            onClick: () => {
              shell.openItem(eval(`${toPlural(type).toUpperCase()}_FOLDER`));
            }
          },
          {
            type: 'button',
            name: Messages.VIZALITY_ENTITIES_LOAD_MISSING.format({ entityType: toHeaderCase(type) }),
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
    return _sortItems([ ...vizality.manager.plugins.values ]);
  };

  const renderBody = () => {
    const items = getItems();
    return (
      <div className='vizality-entities-manage-items'>
        {renderSearch()}
        {items.length === 0
          ? <div className='vizality-entities-manage-items-empty'>
            <div className={getModule('emptyStateImage', 'emptyStateSubtext').emptyStateImage}/>
            <p>{Messages.GIFT_CONFIRMATION_HEADER_FAIL}</p>
            <p>{Messages.SEARCH_NO_RESULTS}</p>
          </div>
          : items.map(item => renderItem(item))}
      </div>
    );
  };

  const renderTabs = () => {
    const { item } = getModule('item', 'topPill');
    const { Types } = getModuleByDisplayName('TabBar');
    return (
      <>
        <div className='vizality-entities-manage-tabs'>
          <TabBar
            selectedItem={currentTab}
            onItemSelect={tab => setCurrentTab(tab)}
            type={Types.TOP_PILL}
          >
            <TabBar.Item className={item} selectedItem={currentTab} id='INSTALLED'>
              {Messages.VIZALITY_INSTALLED}
            </TabBar.Item>
            <TabBar.Item className={item} selectedItem={currentTab} id='DISCOVER'>
              {Messages.DISCOVER}
            </TabBar.Item>
          </TabBar>
          {renderButtons()}
        </div>
      </>
    );
  };

  const _toggle = (pluginID, enabled) => {
    let fn;
    let plugins;
    if (enabled) {
      plugins = [ pluginID ].concat(vizality.manager.plugins.get(pluginID).dependencies);
      fn = vizality.manager.plugins.enable.bind(vizality.manager.plugins);
    } else {
      plugins = [ pluginID ].concat(vizality.manager.plugins.get(pluginID).dependents);
      fn = vizality.manager.plugins.disable.bind(vizality.manager.plugins);
    }

    const apply = async () => {
      for (const plugin of plugins) {
        await fn(plugin);
      }
    };

    if (plugins.length === 1) {
      return apply();
    }

    const title = enabled
      ? Messages.VIZALITY_ENTITIES_ENABLE.format({ entityType: type })
      : Messages.VIZALITY_ENTITIES_DISABLE.format({ entityType: type });
    const note = enabled
      ? Messages.VIZALITY_ENTITIES_ENABLE_NOTE.format({ entityType: type })
      : Messages.VIZALITY_ENTITIES_DISABLE_NOTE.format({ entityType: type });
    openModal(() => (
      <Confirm
        red={!enabled}
        header={title}
        confirmText={title}
        cancelText={Messages.CANCEL}
        onConfirm={async () => {
          await apply();
          // this.forceUpdate();
          closeModal();
        }}
        onCancel={closeModal}
      >
        <div className='vizality-entity-modal'>
          <span>{note}</span>
          <ul>
            {plugins.map(p => <li key={p.id}>{vizality.manager.plugins.get(p).manifest.name}</li>)}
          </ul>
        </div>
      </Confirm>
    ));
  };

  const _uninstall = (addonId) => {
    const plugins = [ addonId ].concat(vizality.manager.plugins.get(addonId).dependents);
    openModal(() => (
      <Confirm
        red
        header={Messages.VIZALITY_ENTITIES_UNINSTALL.format({ entityType: type, count: plugins.length })}
        confirmText={Messages.VIZALITY_ENTITIES_UNINSTALL.format({ entityType: type, count: plugins.length })}
        cancelText={Messages.CANCEL}
        onCancel={closeModal}
        onConfirm={async () => {
          for (const plugin of plugins) {
            await vizality.manager.plugins.uninstall(plugin);
          }
          // this.forceUpdate();
          closeModal();
        }}
      >
        <div className='vizality-entity-modal'>
          <span>{Messages.VIZALITY_ENTITIES_UNINSTALL_SURE.format({ entity: type, count: plugins.length })}</span>
          <ul>
            {plugins.map(p => <li key={p.id}>{vizality.manager.plugins.get(p).manifest.name}</li>)}
          </ul>
        </div>
      </Confirm>
    ));
  };

  return (
    <>
      {renderTabs()}
      {tab === 'DISCOVER'
        ? <div className={`vizality-entities-manage ${colorStandard}`}>
          <div className='vizality-entities-manage-header'>
            <span>{Messages[`VIZALITY_ENTITIES_${tab}`].format({ entityType: toHeaderCase(type) })}</span>
          </div>
          <Divider/>
          {renderBody()}
        </div>
        : <AddonList type='plugin' tab='INSTALLED' />}
    </>
  );
});
