import React, { memo, useState } from 'react';

import { Icon, CodeBlock, ComponentPreview } from '@vizality/components';
import { getModule, getModuleByDisplayName } from '@vizality/webpack';
import { joinClassNames } from '@vizality/util';

import AsideNav from '../../../parts/AsideNav';
import Section from '../../../parts/Section';
import Content from '../../../parts/Content';
import Layout from '../../../parts/Layout';

// @todo Remember to use @vizality/component later when you add this.
const TextInput = getModuleByDisplayName('TextInput');

export default memo(() => {
  const [ selectedIcon, setSelectedIcon ] = useState('');
  const [ query, setQuery ] = useState('');
  const [ hasSearchResults ] = useState(true);
  const { marginBottom20 } = getModule('marginBottom20');
  const { weightMedium } = getModule('weightMedium');
  const { size20 } = getModule('size24');

  const _sortItems = icons => {
    if (query && query !== '') {
      const search = query.toLowerCase();
      icons = icons.filter(icon => icon.toLowerCase().includes(search));
    }

    return icons.sort();
  };

  const _getItems = () => {
    return _sortItems(Icon.Names);
  };

  const renderIcon = icon => {
    return (
      <Icon
        name={icon}
        tooltip={icon}
        className={joinClassNames('vz-docs-components-icons-icon-wrapper', { 'vz-is-active': icon === selectedIcon })} iconClassName='vz-docs-components-icons-icon'
        onClick={() => { icon === selectedIcon ? setSelectedIcon('') : setSelectedIcon(icon); }}
      />
    );
  };

  const renderPreviewTab = () => {
    const items = _getItems();
    return (
      <>
        {!items.length
          ? <div className='vz-component-preview-no-results'>
            <div className='vz-component-preview-no-results-image' />
            <div className={`vz-component-preview-no-results-text ${marginBottom20}`}>
              {`There were no icons found matching "${query}"`}
            </div>
          </div>
          : <>
            {items.map(icon => renderIcon(icon))}
          </>}
      </>
    );
  };

  const renderSearch = () => {
    return (
      <div className='vz-component-preview-search'>
        <TextInput
          className='vz-component-preview-search-input-wrapper'
          size={TextInput.Sizes.MINI}
          placeholder='Filter'
          value={query}
          onChange={query => {
            setQuery(query);
          }}
        />
      </div>
    );
  };

  const renderAside = () => {
    return (
      <>
        {hasSearchResults && selectedIcon && <>
          <div className={joinClassNames('vz-docs-components-icons-aside-icon-name', size20, marginBottom20, weightMedium)}>
            {selectedIcon}
          </div>
          <Icon
            name={selectedIcon}
            size='100%'
            className='vz-docs-components-icons-aside-icon-wrapper'
          />
        </>}
      </>
    );
  };

  const renderCodeTab = () => {
    return (
      <>
        <CodeBlock language='js' header='JSX' content={
          `import React from 'react';\n` +
          `import { Icon } from '@vizality/components';\n\n` +
          `<Icon name='${selectedIcon}' />`}
        />
        <CodeBlock language='js' header='React' content={
          `import React from 'react';\n` +
          `import { Icon } from '@vizality/components';\n\n` +
          `React.createElement(Icon, {\n` +
          `  name: '${selectedIcon}'\n` +
          `});`}
        />
      </>
    );
  };

  return (
    <Layout>
      <Content heading='Components' subheading='I like components and stuff'>
        <Section heading='Icons' subheading='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare tellus nec dapibus finibus. Nulla massa velit, mattis non eros a, interdum tristique massa. Curabitur mauris sem, porttitor quis ligula vitae, suscipit hendrerit quam. Nunc sit amet enim id elit vehicula tempus sed sed tellus. Aliquam felis turpis, malesuada ut tortor id, iaculis facilisis felis.'>
          <ComponentPreview
            aside={renderAside()}
            tabChildren={renderSearch()}
            previewTabChildren={renderPreviewTab()}
            codeTabChildren={renderCodeTab()}
          />
        </Section>
      </Content>
      <AsideNav type='Components' />
    </Layout>
  );
});
