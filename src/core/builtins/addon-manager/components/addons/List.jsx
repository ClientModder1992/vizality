import { Spinner, DeferredRender } from '@vizality/components';
import Webpack from '@vizality/webpack';
import Hooks from '@vizality/hooks';
import I18n from '@vizality/i18n';
import Util from '@vizality/util';
import React from 'react';
import path from 'path';
import fs from 'fs';

import StickyBar from './parts/StickyBar';
import Addon from '../addon/Addon';

export default React.memo(({ type, tab, search, displayType, limit, className }) => {
  const { getSetting, updateSetting } = vizality.api.settings._fluxProps('addon-manager');
  const [ currentTab, setCurrentTab ] = React.useState(tab || 'installed');
  const [ query, setQuery ] = React.useState(search || '');
  const [ display, setDisplay ] = React.useState(displayType || getSetting('listDisplay', 'card'));
  const [ showPreviewImages, setShowPreviewImages ] = React.useState(getSetting('showPreviewImages', false));
  const [ resultsCount, setResultsCount ] = React.useState(null);
  const { colorStandard } = Webpack.getModule('colorStandard');
  const forceUpdate = Hooks.useForceUpdate();

  React.useEffect(() => {
    // @todo Set up uninstall event forceUpdate here
    return () => void 0; // then clean it up
  }, []);

  const _checkForPreviewImages = (addonId) => {
    const addon = vizality.manager[Util.string.toPlural(type)].get(addonId);
    const screenshotsDir = path.join(addon.path, 'screenshots');

    const hasPreviewImages = fs.existsSync(screenshotsDir) && fs.lstatSync(screenshotsDir).isDirectory();

    if (!hasPreviewImages) return false;

    return true;
  };

  const _getPreviewImages = (addonId) => {
    if (!_checkForPreviewImages(addonId)) return [];

    const addon = vizality.manager[Util.string.toPlural(type)].get(addonId);

    const previewImages = [];
    const validExtensions = [ '.png', '.gif', '.jpg', '.jpeg', '.webp' ];
    fs.readdirSync(path.join(addon.path, 'screenshots'))
      .filter(file => validExtensions.indexOf(path.extname(file).toLowerCase()) !== -1)
      .map(file => previewImages.push(`vz-${type}://${addonId}/screenshots/${file}`));

    return previewImages;
  };

  /*
   * Including these in this component so we can forceUpdate the switches.
   * There's probably a better way to do it.
   */
  const _enableAll = async type => {
    await vizality.manager[Util.string.toPlural(type)].enableAll();
    forceUpdate();
  };

  const _disableAll = async type => {
    await vizality.manager[Util.string.toPlural(type)].disableAll();
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
    return _sortItems([ ...vizality.manager[Util.string.toPlural(type)].values ]);
  };

  const _toggle = async (addonId, enabled) => {
    let fn;

    if (enabled) {
      fn = vizality.manager[Util.string.toPlural(type)].enable.bind(vizality.manager[Util.string.toPlural(type)]);
    } else {
      fn = vizality.manager[Util.string.toPlural(type)].disable.bind(vizality.manager[Util.string.toPlural(type)]);
    }

    await fn(addonId);
    forceUpdate();
  };

  const _uninstall = async (addonId, type) => {
    await vizality.manager[Util.string.toPlural(type)].uninstall(addonId);
  };

  const renderItem = item => {
    return (
      <Addon
        display={display}
        type={type}
        manifest={item.manifest}
        addonId={item.addonId}
        isEnabled={vizality.manager[Util.string.toPlural(type)].isEnabled(item.addonId)}
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
            <div className={Webpack.getModule('emptyStateImage', 'emptyStateSubtext')?.emptyStateImage}/>
            <p>{I18n.Messages.GIFT_CONFIRMATION_HEADER_FAIL}</p>
            <p>{I18n.Messages.SEARCH_NO_RESULTS}</p>
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
            <span className='vz-addons-list-search-results-count'>{resultsCount}</span> {Util.string.toPlural(type)} found{!query && limit && resultsCount > limit && `... Showing ${limit}.`} {query && query !== '' && <>
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
        className={Util.dom.joinClassNames('vz-addons-list', className, colorStandard)}
        vz-display={display}
        vz-previews={Boolean(showPreviewImages) && ''}
        vz-type={type}
      >
        <StickyBar
          type={type}
          query={query}
          tab={currentTab}
          display={display}
          handleTabChange={_handleTabChange}
          handleQueryChange={_handleQueryChange}
          handleDisplayChange={_handleDisplayChange}
          enableAll={_enableAll}
          disableAll={_disableAll}
          resetSearchOptions={_resetSearchOptions}
          getSetting={getSetting}
          updateSetting={updateSetting}
          showPreviewImages={showPreviewImages}
          handleShowPreviewImages={_handleShowPreviewImages}
        />
        <DeferredRender
          idleTimeout={1000}
          fallback={
            <div className='vz-addons-list-inner' vz-loading=''>
              <Spinner className='vz-addons-list-spinner' />
            </div>
          }
        >
          <div className='vz-addons-list-inner'>
            {renderHeader()}
            {renderBody()}
          </div>
        </DeferredRender>
      </div>
    </>
  );
});
