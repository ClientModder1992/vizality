import React, { memo, useState, useReducer, useEffect } from 'react';

import { existsSync, lstatSync, readdirSync } from 'fs';
import { join, extname } from 'path';

import { toPlural, toTitleCase } from '@vizality/util/string';
import { joinClassNames } from '@vizality/util/dom';
import { Spinner } from '@vizality/components';
import { getModule } from '@vizality/webpack';
import { Messages } from '@vizality/i18n';

import StickyBar from './parts/StickyBar';
import Addon from '../addon/Addon';

export default memo(({ type, tab, search, displayType, limit, className }) => {
  const { getSetting, updateSetting } = vizality.api.settings._fluxProps('vz-addon-manager');

  const [ loading, setLoading ] = useState(true);
  const [ currentTab, setCurrentTab ] = useState(tab || 'installed');
  const [ query, setQuery ] = useState(search || '');
  const [ display, setDisplay ] = useState(displayType || getSetting('listDisplay', 'list'));
  const [ showPreviewImages, setShowPreviewImages ] = useState(getSetting('showPreviewImages', false));
  const [ resultsCount, setResultsCount ] = useState(null);
  const [ , forceUpdate ] = useReducer(x => x + 1, 0);
  const { colorStandard } = getModule('colorStandard');

  useEffect(() => {
    setLoading(false);
  }, []);

  const _checkForPreviewImages = (addonId) => {
    const addon = vizality.manager[toPlural(type)].get(addonId);
    const screenshotsDir = join(addon.path, 'screenshots');

    const hasPreviewImages = existsSync(screenshotsDir) && lstatSync(screenshotsDir).isDirectory();

    if (!hasPreviewImages) return false;

    return true;
  };

  const _getPreviewImages = (addonId) => {
    if (!_checkForPreviewImages(addonId)) return [];

    const addon = vizality.manager[toPlural(type)].get(addonId);

    const previewImages = [];
    const validExtensions = [ '.png', '.gif', '.jpg', '.jpeg', '.webp' ];

    readdirSync(join(addon.path, 'screenshots'))
      .filter(file => validExtensions.indexOf(extname(file).toLowerCase()) !== -1)
      .map(file => previewImages.push(`vz-${type}://${addonId}/screenshots/${file}`));

    return previewImages;
  };

  /*
   * Including these in this component so we can forceUpdate the switches.
   * There's probably a better way to do it.
   */
  const _enableAll = async type => {
    await vizality.manager[toPlural(type)].enableAll();
    forceUpdate();
  };

  const _disableAll = async type => {
    await vizality.manager[toPlural(type)].disableAll();
    forceUpdate();
  };

  const _resetSearchOptions = () => {
    return setQuery('');
  };

  const _handleShowPreviewImages = (bool) => {
    updateSetting('showPreviewImages', bool);
    return setShowPreviewImages(bool);
  };

  const _handleDisplayChange = (display) => {
    updateSetting('listDisplay', display);
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

    const missingAddons = await vizality.manager[toPlural(type)].initialize(true);
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

    if (enabled) {
      fn = vizality.manager[toPlural(type)].enable.bind(vizality.manager[toPlural(type)]);
    } else {
      fn = vizality.manager[toPlural(type)].disable.bind(vizality.manager[toPlural(type)]);
    }

    await fn(addonId);
    forceUpdate();
  };

  const _uninstall = (addonId, type) => {
    vizality.manager[toPlural(type)].uninstall(addonId);
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
        onUninstall={() => _uninstall(item.addonId, type)}
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
            {!limit
              ? items.map(item => renderItem(item))
              : items.slice(0, limit).map(item => renderItem(item))
            }
            {!limit
              ? renderFillers()
              : null
            }
          </>}
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <>
        <div className='vz-addons-list-search-results-text-wrapper'>
          <div className='vz-addons-list-search-results-text'>
            <span className='vz-addons-list-search-results-count'>{resultsCount}</span> {toPlural(type)} found{!query && limit && resultsCount > limit && `... Showing ${limit}.`} {query && query !== '' && <>
              matching "<span className='vz-addons-list-search-results-matched'>{query}</span>"{limit && resultsCount > limit && `... Showing ${limit}.`}
            </>}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div
        className={joinClassNames('vz-addons-list', className, colorStandard)}
        vz-display={display}
        vz-previews={Boolean(showPreviewImages) && ''}
        vz-plugins={Boolean(type === 'plugin') && ''}
        vz-themes={Boolean(type === 'theme') && ''}
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
