import React, { memo, useState } from 'react';

import { ContextMenu, SearchBar } from '@vizality/components';
import { toPlural } from '@vizality/util/string';
import { useForceUpdate } from '@vizality/hooks';
import { Messages } from '@vizality/i18n';

export default memo(() => {
  const [ pluginQuery, setPluginQuery ] = useState('');
  const [ themeQuery, setThemeQuery ] = useState('');
  const forceUpdate = useForceUpdate();

  const plugins =
    vizality.manager.plugins.keys
      .sort((a, b) => a - b)
      .map(plugin => vizality.manager.plugins.get(plugin));

  const themes =
    vizality.manager.themes.keys
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
      <ContextMenu.CheckboxItem
        vz-addon-icon={item.manifest.icon}
        id={item.addonId}
        label={item.manifest.name}
        checked={vizality.manager[toPlural(type)].isEnabled(item.addonId)}
        action={async () => {
          vizality.manager[toPlural(type)].isEnabled(item.addonId)
            ? await vizality.manager[toPlural(type)].disable(item.addonId)
            : await vizality.manager[toPlural(type)].enable(item.addonId);
          forceUpdate();
        }}
      >
        <img src={item.manifest.icon} />
      </ContextMenu.CheckboxItem>
    );
  };

  const renderItems = type => {
    const items = getItems(type);
    return items.map(item => renderContextItem(item, type));
  };

  return (
    <>
      <ContextMenu.Separator />
      <ContextMenu.Item
        id='vizality'
        label='Vizality'
        action={() => vizality.api.routes.navigate('home')}
      >
        <ContextMenu.Item
          id='home'
          label='Home'
          action={() => vizality.api.routes.navigate('home')}
        />
        <ContextMenu.Item
          id='settings'
          label='Settings'
          action={() => vizality.api.routes.navigate('settings')}
        />
        <ContextMenu.Item
          id='plugins'
          label='Plugins'
          action={() => vizality.api.routes.navigate('plugins')}
        >
          {plugins.length && <>
            {/* <ContextMenu.ControlItem
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
            <ContextMenu.Group>
              {renderItems('plugins')}
            </ContextMenu.Group>
          </>}
        </ContextMenu.Item>
        <ContextMenu.Item
          id='themes'
          label='Themes'
          action={() => vizality.api.routes.navigate('themes')}
        >
          {themes.length && <>
            {/* <ContextMenu.ControlItem
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
            <ContextMenu.Group>
              {renderItems('themes')}
            </ContextMenu.Group>
          </>}
        </ContextMenu.Item>
        {vizality.manager.builtins.isEnabled('vz-snippet-manager') && <ContextMenu.Item
          id='snippets'
          label='Snippets'
          action={() => vizality.api.routes.navigate('snippets')}
        />}
        {vizality.manager.builtins.isEnabled('vz-quick-code') && <ContextMenu.Item
          id='quick-code'
          label='Quick Code'
          action={() => vizality.api.routes.navigate('quick-code')}
        />}
        <ContextMenu.Item
          id='theme-editor'
          label='Theme Editor'
          disabled={true}
        />
        <ContextMenu.Separator/>
        <ContextMenu.Item
          id='developers'
          label='Developers'
          action={() => vizality.api.routes.navigate('developers')}
        />
        <ContextMenu.Item
          id='documentation'
          label='Documentation'
          action={() => vizality.api.routes.navigate('docs')}
        >
          <ContextMenu.Item
            id='getting-started'
            label='Getting Started'
            action={() => vizality.api.routes.navigate('docs/getting-started')}
          />
          <ContextMenu.Item
            id='plugins'
            label='Plugins'
            action={() => vizality.api.routes.navigate('docs/plugins')}
          />
          <ContextMenu.Item
            id='themes'
            label='Themes'
            action={() => vizality.api.routes.navigate('docs/themes')}
          />
          <ContextMenu.Item
            id='screenshots'
            label='Screenshots'
            action={() => vizality.api.routes.navigate('docs/components/screenshots')}
          />
          <ContextMenu.Item
            id='icons'
            label='Components'
            action={() => vizality.api.routes.navigate('docs/components/icons')}
          />
          <ContextMenu.Item
            id='markdown'
            label='Markdown'
            action={() => vizality.api.routes.navigate('docs/components/markdown')}
          />
          <ContextMenu.Item
            id='error-test'
            label='Error Test'
            action={() => vizality.api.routes.navigate('docs/components/error-test')}
          />
          <ContextMenu.Item
            id='test'
            label='Test'
            action={() => vizality.api.routes.navigate('docs/components/test')}
          />
        </ContextMenu.Item>
        <ContextMenu.Separator/>
        <ContextMenu.Item
          id='updater'
          label='Updater'
          action={() => vizality.api.routes.navigate('updater')}
        />
        <ContextMenu.Item
          id='changelog'
          label='Changelog'
          action={() => vizality.api.routes.navigate('changelog')}
        />
      </ContextMenu.Item>
    </>
  );
});
