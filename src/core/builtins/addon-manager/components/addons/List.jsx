/* eslint-disable no-use-before-define *//* eslint-disable no-unused-vars */
const { existsSync, lstatSync, readdirSync } = require('fs');
const { join, extname } = require('path');

const { React, React: { useState, useReducer, useEffect } } = require('@vizality/react');
const { string: { toPlural, toTitleCase }, joinClassNames } = require('@vizality/util');
const { open: openModal, close: closeModal } = require('@vizality/modal');
const { Confirm, Spinner, Text, LazyImage } = require('@vizality/components');
const { getModule } = require('@vizality/webpack');
const { Messages } = require('@vizality/i18n');

const StickyBar = require('./parts/StickyBar');
const Addon = require('../addon/Addon');

module.exports = React.memo(({ type, tab, search }) => {
  const getSetting = vizality.manager.builtins.get('addon-manager').settings.get;
  const updateSetting = vizality.manager.builtins.get('addon-manager').settings.set;

  const [ loading, setLoading ] = useState(true);
  const [ currentTab, setCurrentTab ] = useState(tab || 'INSTALLED');
  const [ query, setQuery ] = useState(search || '');
  const [ display, setDisplay ] = useState(getSetting('list-display', 'card'));
  const [ showPreviewImages, setShowPreviewImages ] = useState(getSetting('addon-list-show-preview-images', false));
  const [ resultsCount, setResultsCount ] = useState(null);
  const [ , forceUpdate ] = useReducer(x => x + 1, 0);
  const { colorStandard } = getModule('colorStandard');

  useEffect(() => {
    setLoading(false);
  }, []);

  const _checkForPreviewImages = (addonId) => {
    const addon = vizality.manager[toPlural(type)].get(addonId);
    const screenshotsDir = join(addon.addonPath, 'screenshots');

    const hasPreviewImages = existsSync(screenshotsDir) && lstatSync(screenshotsDir).isDirectory();

    if (!hasPreviewImages) return false;

    return true;
  };

  const _getPreviewImages = (addonId) => {
    if (!_checkForPreviewImages(addonId)) return [];

    const addon = vizality.manager[toPlural(type)].get(addonId);

    const previewImages = [];
    const validExtensions = [ '.png', '.gif', '.jpg', '.jpeg', '.webp' ];

    readdirSync(join(addon.addonPath, 'screenshots'))
      .filter(file => validExtensions.indexOf(extname(file).toLowerCase()) !== -1)
      .map(file => previewImages.push(`vz-${type}://${addonId}/screenshots/${file}`));

    return previewImages;
  };

  /*
   * Including these in this component so we can forceUpdate the switches.
   * There's probably a better way to do it.
   */
  const _enableAll = type => {
    vizality.manager[toPlural(type)].enableAll();
    forceUpdate();
  };

  const _disableAll = type => {
    vizality.manager[toPlural(type)].disableAll();
    forceUpdate();
  };

  const _resetSearchOptions = () => {
    return setQuery('');
  };

  const _handleShowPreviewImages = (bool) => {
    updateSetting('addon-list-show-preview-images', bool);
    return setShowPreviewImages(bool);
  };

  const _handleDisplayChange = (display) => {
    updateSetting('list-display', display);
    return setDisplay(display);
  };

  const _handleQueryChange = (query) => {
    return setQuery(query);
  };

  const _handleTabChange = (tab) => {
    return setCurrentTab(tab);
  };

  const _fetchMissing = async type => {
    vizality.api.notices.closeToast('vz-addon-manager-fetch-entities');

    const missingAddons = vizality.manager[toPlural(type)].load(true);
    const missingAddonsList = missingAddons.length
      ? <>
        <div>{Messages.VIZALITY_MISSING_ADDONS_RETRIEVED.format({ entity: type, count: missingAddons.length })}</div>
        <ul>
          {missingAddons.map(entity => <li>{`– ${entity}`}</li>)}
        </ul>
      </>
      : Messages.VIZALITY_MISSING_ADDONS_NONE;

    vizality.api.notices.sendToast('vz-addon-manager-fetch-entities', {
      header: Messages.VIZALITY_MISSING_ADDONS_FOUND.format({ type, count: missingAddons.length || 0 }),
      content: missingAddonsList,
      type: missingAddons.length > 0 && 'success',
      icon: toTitleCase(type),
      timeout: 5e3,
      buttons: [
        {
          text: 'Got it',
          look: 'ghost'
        }
      ]
    });
  };

  const _sortItems = items => {
    if (query && query !== '') {
      const search = query.toLowerCase();
      items = items.filter(p =>
        p.manifest.name.toLowerCase().includes(search) ||
        p.manifest.author.name?.toLowerCase().includes(search) ||
        (typeof p.manifest.author === 'string' && p.manifest.author.toLowerCase().includes(search)) ||
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

  const _getItems = () => {
    return _sortItems([ ...vizality.manager[toPlural(type)].values ]);
  };

  const _toggle = async (addonId, enabled) => {
    let fn;
    let addons;

    // Plugins
    if (enabled && type !== 'theme') {
      addons = [ addonId ].concat(vizality.manager[toPlural(type)].get(addonId).dependencies);
      fn = vizality.manager[toPlural(type)].enable.bind(vizality.manager[toPlural(type)]);
    } else {
      if (!enabled && type !== 'theme') {
        addons = [ addonId ].concat(vizality.manager[toPlural(type)].get(addonId).dependents);
        fn = vizality.manager[toPlural(type)].disable.bind(vizality.manager[toPlural(type)]);
      }
    }

    // Themes
    if (type === 'theme') {
      addons = [ addonId ];
      if (enabled) {
        fn = vizality.manager[toPlural(type)].enable.bind(vizality.manager[toPlural(type)]);
      } else {
        fn = vizality.manager[toPlural(type)].disable.bind(vizality.manager[toPlural(type)]);
      }
    }

    // @todo Handle this. Not sure how or when this would happen, though.
    if (!addons.length) {
      return console.log('Error, uhoh bad.');
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
        <Text>
          <span>{note}</span>
          <ul>
            {addons.map(p => <li key={p.id}>{vizality.manager[toPlural(type)].get(p).manifest.name}</li>)}
          </ul>
        </Text>
      </Confirm>
    ));
  };

  const _uninstall = (addonId) => {
    let addons;

    // Themes
    if (type === 'theme') addons = [ addonId ];
    // Plugins
    else addons = [ addonId ].concat(vizality.manager[toPlural(type)].get(addonId).dependents);

    openModal(() => (
      <Confirm
        red
        header={Messages.VIZALITY_ADDONS_UNINSTALL.format({ type: toTitleCase(type), count: addons.length })}
        confirmText={Messages.VIZALITY_ADDONS_UNINSTALL.format({ type: toTitleCase(type), count: addons.length })}
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
        <Text>
          <span>{Messages.VIZALITY_ADDONS_UNINSTALL_SURE.format({ type, count: addons.length })}</span>
          <ul className='vz-addon-uninstall-modal-ul'>
            {addons.map(p => {
              const addon = vizality.manager[toPlural(type)].get(p);
              return (
                <li className='vz-addon-uninstall-modal-li' vz-addon-id={p} key={p.id}>
                  <div className='vz-addon-uninstall-modal-icon'>
                    <LazyImage
                      className='vz-addon-uninstall-modal-icon-image-wrapper'
                      imageClassName='vz-addon-uninstall-modal-icon-img'
                      src={addon.manifest.icon}
                      width='20'
                      height='20'
                    />
                  </div>
                  <div className='vz-addon-uninstall-modal-name'>
                    {addon.manifest.name}
                  </div>
                </li>
              );
            })}
          </ul>
        </Text>
      </Confirm>
    ));
  };

  const renderItem = item => {
    return (
      <Addon
        display={display}
        type={type}
        manifest={item.manifest}
        addonId={item.addonId}
        isEnabled={vizality.manager[toPlural(type)].isEnabled(item.addonId)}
        onToggle={async v => _toggle(item.addonId, v)}
        onUninstall={() => _uninstall(item.addonId)}
        previewImages={_getPreviewImages(item.addonId)}
        hasPreviewImages={_checkForPreviewImages(item.addonId)}
        showPreviewImages={showPreviewImages}
      />
    );
  };

  /*
   * The only purpose of this is to add filler addon items to correct the
   * last flex row of the list.
   */
  const renderFillers = () => {
    const placeholders = [];
    for (let i = 0; i < 8; i++) {
      placeholders.push(
        <div className='vz-addon-card vz-addon-card-filler' />
      );
    }
    return placeholders;
  };

  const renderBody = () => {
    const items = _getItems();
    if (items.length !== resultsCount) setResultsCount(items.length);
    return (
      <div className='vz-addons-list-items'>
        {items.length === 0
          ? <div className='vz-addons-list-empty'>
            <div className={getModule('emptyStateImage', 'emptyStateSubtext').emptyStateImage}/>
            <p>{Messages.GIFT_CONFIRMATION_HEADER_FAIL}</p>
            <p>{Messages.SEARCH_NO_RESULTS}</p>
          </div>
          : <>
            {items.map(item => renderItem(item))}
            {renderFillers()}
          </>}
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <>
        <div className='vz-addons-list-search-results-text-wrapper'>
          <div className='vz-addons-list-search-results-text'>
            <span className='vz-addons-list-search-results-count'>{resultsCount}</span> {toPlural(type)} found {query && query !== '' && <>
              matching "<span className='vz-addons-list-search-results-matched'>{query}</span>"
            </>}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div
        className={joinClassNames('vz-addons-list', colorStandard)}
        vz-display={display}
        vz-previews={showPreviewImages ? '' : null}
        vz-plugins={type === 'plugin' ? '' : null}
        vz-themes={type === 'theme' ? '' : null}
      >
        <StickyBar
          type={type}
          query={query}
          tab={currentTab}
          display={display}
          handleTabChange={_handleTabChange}
          handleQueryChange={_handleQueryChange}
          handleDisplayChange={_handleDisplayChange}
          fetchMissing={_fetchMissing}
          enableAll={_enableAll}
          disableAll={_disableAll}
          resetSearchOptions={_resetSearchOptions}
          getSetting={getSetting}
          updateSetting={updateSetting}
          showPreviewImages={showPreviewImages}
          handleShowPreviewImages={_handleShowPreviewImages}
        />
        <div className='vz-addons-list-inner'>
          {loading
            ? <Spinner className='vz-addons-list-loading' />
            : <>
              {renderHeader()}
              {renderBody()}
            </>
          }
        </div>
      </div>
    </>
  );
});
