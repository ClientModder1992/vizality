const { React, React: { useState, useReducer } } = require('@vizality/react');
const { Menu, Icon, SearchBar } = require('@vizality/components');
const { string: { toPlural } } = require('@vizality/util');
const { Messages } = require('@vizality/i18n');

module.exports = React.memo(() => {
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
          item.manifest.author.toLowerCase().includes(search) ||
          item.manifest.description.toLowerCase().includes(search)
        );
      }
    } else {
      if (themeQuery && themeQuery !== '') {
        search = themeQuery.toLowerCase();
        items = items.filter(item =>
          item.manifest.name.toLowerCase().includes(search) ||
          item.manifest.author.toLowerCase().includes(search) ||
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
        action={() => vizality.api.router.navigate('/dashboard')}
      >
        <Menu.MenuItem
          id='home'
          label='Home'
          icon={() => <Icon name='Home' width='100%' height='100%' />}
          action={() => vizality.api.router.navigate('/dashboard/home')}
        />
        <Menu.MenuItem
          id='settings'
          label='Settings'
          icon={() => <Icon name='Wrench' width='100%' height='100%' />}
          action={() => vizality.api.router.navigate('/dashboard/settings')}
        />
        <Menu.MenuItem
          id='plugins'
          label='Plugins'
          icon={() => <Icon name='Plugin' width='100%' height='100%' />}
          action={() => vizality.api.router.navigate('/dashboard/plugins')}
        >
          {plugins.length && <>
            <Menu.MenuControlItem
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
            />
            <Menu.MenuGroup label='Plugins'>
              {renderItems('plugins')}
            </Menu.MenuGroup>
          </>}
        </Menu.MenuItem>
        <Menu.MenuItem
          id='themes'
          label='Themes'
          icon={() => <Icon name='Theme' width='100%' height='100%' />}
          action={() => vizality.api.router.navigate('/dashboard/themes')}
        >
          {themes.length && <>
            <Menu.MenuControlItem
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
            />
            <Menu.MenuGroup label='Themes'>
              {renderItems('themes')}
            </Menu.MenuGroup>
          </>}
        </Menu.MenuItem>
        <Menu.MenuItem
          id='snippets'
          label='Snippets'
          icon={() => <Icon name='Scissors' width='100%' height='100%' />}
          action={() => vizality.api.router.navigate('/dashboard/snippets')}
        />
        <Menu.MenuItem
          id='quick-code'
          label='Quick Code'
          icon={() => <Icon name='Compose' width='100%' height='100%' />}
          action={() => vizality.api.router.navigate('/dashboard/quick-code')}
        />
        <Menu.MenuItem
          id='theme-editor'
          label='Theme Editor'
          icon={() => <Icon name='Settings' width='100%' height='100%' />}
          disabled={true}
        />
        <Menu.MenuSeparator/>
        <Menu.MenuItem
          id='developers'
          label='Developers'
          icon={() => <Icon name='UnknownUser' width='100%' height='100%' />}
          action={() => vizality.api.router.navigate('/dashboard/developers')}
        />
        <Menu.MenuItem
          id='documentation'
          label='Documentation'
          icon={() => <Icon name='Science' width='100%' height='100%' />}
          action={() => vizality.api.router.navigate('/dashboard/documentation')}
        >
          <Menu.MenuItem
            id='getting-started'
            label='Getting Started'
            action={() => vizality.api.router.navigate('/dashboard/documentation/getting-started')}
          />
          <Menu.MenuItem
            id='plugins'
            label='Plugins'
            action={() => vizality.api.router.navigate('/dashboard/documentation/plugins')}
          />
          <Menu.MenuItem
            id='themes'
            label='Themes'
            action={() => vizality.api.router.navigate('/dashboard/documentation/themes')}
          />
          <Menu.MenuItem
            id='screenshots'
            label='Screenshots'
            action={() => vizality.api.router.navigate('/dashboard/documentation/screenshots')}
          />
          <Menu.MenuItem
            id='icons'
            label='Components'
            action={() => vizality.api.router.navigate('/dashboard/documentation/components/icons')}
          />
          <Menu.MenuItem
            id='markdown'
            label='Markdown'
            action={() => vizality.api.router.navigate('/dashboard/documentation/markdown')}
          />
          <Menu.MenuItem
            id='error-test'
            label='Error Test'
            action={() => vizality.api.router.navigate('/dashboard/documentation/error-test')}
          />
          <Menu.MenuItem
            id='test'
            label='Test'
            action={() => vizality.api.router.navigate('/dashboard/documentation/test')}
          />
        </Menu.MenuItem>
        <Menu.MenuSeparator/>
        <Menu.MenuItem
          id='updater'
          label='Updater'
          icon={() => <Icon name='CloudDownload' width='100%' height='100%' />}
          action={() => vizality.api.router.navigate('/dashboard/updater')}
        />
        <Menu.MenuItem
          id='changelog'
          label='Changelog'
          icon={() => <Icon name='ClockReverse' width='100%' height='100%' />}
          action={() => vizality.api.router.navigate('/dashboard/changelog')}
        />
      </Menu.MenuItem>
    </>
  );
});
