import React, { memo, useState, useReducer } from 'react';

import { ContextMenu, SearchBar } from '@vizality/components';
import { toTitleCase } from '@vizality/util/string';
import { Messages } from '@vizality/i18n';

export default memo(props => {
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
      <ContextMenu.CheckboxItem
        id={`tag-${item}`}
        label={toTitleCase(item)}
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
    <ContextMenu.Menu navId='vz-addons-list-tags-menu' onClose={onClose}>
      <ContextMenu.ControlItem
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
      <ContextMenu.Group label='Tags'>
        {renderResults()}
      </ContextMenu.Group>
    </ContextMenu.Menu>
  );
});
