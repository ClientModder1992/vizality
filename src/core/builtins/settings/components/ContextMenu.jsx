import React, { memo, useState, useReducer } from 'react';

import { Menu, SearchBar } from '@vizality/components';
import { toPlural } from '@vizality/util/string';
import { Messages } from '@vizality/i18n';

export default memo(() => {
  const [ pluginQuery, setPluginQuery ] = useState('');
  const [ themeQuery, setThemeQuery ] = useState('');
  const [ , forceUpdate ] = useReducer(x => x + 1, 0);

  const plugins =
    vizality.manager.plugins.getAll()
      .sort((a, b) => a - b)
      .map(plugin => vizality.manager.plugins.get(plugin));

  const themes =
    vizality.manager.themes.getAll()
      .sort((a, b) => a - b)
      .map(theme => vizality.manager.themes.get(theme));

  const _sortItems = (items, type) => {
    let search;
    if (type === 'plugins') {
      if (pluginQuery && pluginQuery !== '') {
        search = pluginQuery.toLowerCase();
        items = items.filter(item =>
          item.manifest.name.toLowerCase().includes(search) ||
          item.manifest.author.name?.toLowerCase().includes(search) ||
          (typeof item.manifest.author === 'string' && item.manifest.author.toLowerCase().includes(search)) ||
          item.manifest.description.toLowerCase().includes(search)
        );
      }
    } else {
      if (themeQuery && themeQuery !== '') {
        search = themeQuery.toLowerCase();
        items = items.filter(item =>
          item.manifest.name.toLowerCase().includes(search) ||
          item.manifest.author.name?.toLowerCase().includes(search) ||
          (typeof item.manifest.author === 'string' && item.manifest.author.toLowerCase().includes(search)) ||
          item.manifest.description.toLowerCase().includes(search)
        );
      }
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

  const getItems = type => {
    return type === 'plugins' ? _sortItems(plugins, type) : _sortItems(themes, type);
  };

  const renderContextItem = (item, type) => {
    return (
      <Menu.MenuCheckboxItem
        id={item.addonId}
        label={item.manifest.name}
        checked={vizality.manager[toPlural(type)].isEnabled(item.addonId)}
        action={() => {
          vizality.manager[toPlural(type)].isEnabled(item.addonId)
            ? vizality.manager[toPlural(type)].disable(item.addonId)
            : vizality.manager[toPlural(type)].enable(item.addonId);
          forceUpdate();
        }}
      />
    );
  };

  const renderItems = type => {
    const items = getItems(type);
    return items.map(item => renderContextItem(item, type));
  };

  return (
    <>
      <Menu.MenuSeparator />
      <Menu.MenuItem
        id='vizality'
        label='Vizality'
        action={() => vizality.api.router.navigate('dashboard')}
      >
        <Menu.MenuItem
          id='home'
          label='Home'
          action={() => vizality.api.router.navigate('dashboard')}
        />
        <Menu.MenuItem
          id='settings'
          label='Settings'
          action={() => vizality.api.router.navigate('settings')}
        />
        <Menu.MenuItem
          id='plugins'
          label='Plugins'
          action={() => vizality.api.router.navigate('plugins')}
        >
          {plugins.length && <>
            {/* <Menu.MenuControlItem
              id='search-plugins'
              control={(_props, ref) => <SearchBar
                ref={ref}
                autofocus={true}
                placeholder={Messages.SEARCH}
                query={pluginQuery}
                onChange={e => {
                  setPluginQuery(e);
                  forceUpdate();
                }}
                onClear={() => setPluginQuery('')}
              />}
            /> */}
            <Menu.MenuGroup label='Plugins'>
              {renderItems('plugins')}
            </Menu.MenuGroup>
          </>}
        </Menu.MenuItem>
        <Menu.MenuItem
          id='themes'
          label='Themes'
          action={() => vizality.api.router.navigate('themes')}
        >
          {themes.length && <>
            {/* <Menu.MenuControlItem
              id='search-themes'
              control={(_props, ref) => <SearchBar
                ref={ref}
                autofocus={true}
                placeholder={Messages.SEARCH}
                query={themeQuery}
                onChange={e => {
                  setThemeQuery(e);
                  forceUpdate();
                }}
                onClear={() => setThemeQuery('')}
              />}
            /> */}
            <Menu.MenuGroup label='Themes'>
              {renderItems('themes')}
            </Menu.MenuGroup>
          </>}
        </Menu.MenuItem>
        <Menu.MenuItem
          id='snippets'
          label='Snippets'
          action={() => vizality.api.router.navigate('snippets')}
        />
        <Menu.MenuItem
          id='quick-code'
          label='Quick Code'
          action={() => vizality.api.router.navigate('quick-code')}
        />
        <Menu.MenuItem
          id='theme-editor'
          label='Theme Editor'
          disabled={true}
        />
        <Menu.MenuSeparator/>
        <Menu.MenuItem
          id='developers'
          label='Developers'
          action={() => vizality.api.router.navigate('developers')}
        />
        <Menu.MenuItem
          id='documentation'
          label='Documentation'
          action={() => vizality.api.router.navigate('documentation')}
        >
          <Menu.MenuItem
            id='getting-started'
            label='Getting Started'
            action={() => vizality.api.router.navigate('/vizality/dashboard/documentation/getting-started')}
          />
          <Menu.MenuItem
            id='plugins'
            label='Plugins'
            action={() => vizality.api.router.navigate('/vizality/dashboard/documentation/plugins')}
          />
          <Menu.MenuItem
            id='themes'
            label='Themes'
            action={() => vizality.api.router.navigate('/vizality/dashboard/documentation/themes')}
          />
          <Menu.MenuItem
            id='screenshots'
            label='Screenshots'
            action={() => vizality.api.router.navigate('/vizality/dashboard/documentation/screenshots')}
          />
          <Menu.MenuItem
            id='icons'
            label='Components'
            action={() => vizality.api.router.navigate('/vizality/dashboard/documentation/components/icons')}
          />
          <Menu.MenuItem
            id='markdown'
            label='Markdown'
            action={() => vizality.api.router.navigate('/vizality/dashboard/documentation/markdown')}
          />
          <Menu.MenuItem
            id='error-test'
            label='Error Test'
            action={() => vizality.api.router.navigate('/vizality/dashboard/documentation/error-test')}
          />
          <Menu.MenuItem
            id='test'
            label='Test'
            action={() => vizality.api.router.navigate('/vizality/dashboard/documentation/test')}
          />
        </Menu.MenuItem>
        <Menu.MenuSeparator/>
        <Menu.MenuItem
          id='updater'
          label='Updater'
          action={() => vizality.api.router.navigate('updater')}
        />
        <Menu.MenuItem
          id='changelog'
          label='Changelog'
          action={() => vizality.api.router.navigate('changelog')}
        />
      </Menu.MenuItem>
    </>
  );
});
