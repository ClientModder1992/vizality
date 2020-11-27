const { React, React: { useState, useReducer } } = require('@vizality/react');
const { string: { toHeaderCase } } = require('@vizality/util');
const { Menu, SearchBar } = require('@vizality/components');
const { Messages } = require('@vizality/i18n');

module.exports = React.memo(props => {
  const { type, onClose } = props;
  const [ query, setQuery ] = useState('');
  const [ , forceUpdate ] = useReducer(x => x + 1, 0);

  let tags;

  if (type === 'plugin') {
    tags = [ 'pie', 'stuff', 'cool', 'lazers', 'glowing', 'more stuff', 'shark lazers', 'just filler', 'whoa longer fill', 'very cool', 'okay' ];
  } else {
    tags = [ 'poo', 'pizza', 'cake', 'ice cream' ];
  }

  const _sortItems = (items) => {
    let search;
    if (query && query !== '') {
      search = query.toLowerCase();
      items = items.filter(item => item.includes(search));
    }

    return items.sort();
  };

  const renderItem = (item) => {
    return (
      <Menu.MenuCheckboxItem
        id={`tag-${item}`}
        label={toHeaderCase(item)}
        checked={false}
        action={() => {
          void 0;
          forceUpdate();
        }}
      />
    );
  };

  const renderResults = () => {
    const items = _sortItems(tags);
    return items.map(item => renderItem(item, type));
  };

  return (
    <Menu.Menu navId='vz-addons-list-tags-menu' onClose={onClose}>
      <Menu.MenuControlItem
        id='search-tags'
        control={(_props, ref) => <SearchBar
          ref={ref}
          autofocus={true}
          placeholder={Messages.SEARCH}
          query={query}
          onChange={e => {
            setQuery(e);
            forceUpdate();
          }}
          onClear={() => setQuery('')}
        />}
      />
      <Menu.MenuGroup label='Tags'>
        {renderResults()}
      </Menu.MenuGroup>
    </Menu.Menu>
  );
});
