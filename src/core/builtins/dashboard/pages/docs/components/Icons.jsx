import React, { memo, useState } from 'react';

import { Icon, CodeBlock, ComponentPreview, TextInput } from '@vizality/components';
import { joinClassNames } from '@vizality/util/dom';
import { getModule } from '@vizality/webpack';

import AsideNav from '../../../components/parts/AsideNav';
import Section from '../../../components/parts/Section';
import Content from '../../../components/parts/Content';
import Layout from '../../../components/parts/Layout';

const Search = memo(({ query, handleQueryChange }) => (
  <div className='vz-component-preview-search'>
    <TextInput
      className='vz-component-preview-search-input-wrapper'
      size={TextInput.Sizes.MINI}
      placeholder='Filter'
      value={query}
      onChange={handleQueryChange}
    />
  </div>
));

const DocsIcon = memo(({ icon, selectedIcon, handleSelectedIcon }) => {
  return (
    <Icon
      name={icon}
      tooltip={icon}
      vz-active={Boolean(selectedIcon === icon) && ''}
      className='vz-docs-components-icons-icon-wrapper'
      iconClassName='vz-docs-components-icons-icon'
      onClick={() => handleSelectedIcon(icon)}
    />
  );
});

const Preview = memo(({ query, selectedIcon, handleSort, handleSelectedIcon }) => {
  const icons = handleSort(Icon.Names);
  const { marginBottom20 } = getModule('marginBottom20');
  return (
    <>
      {!icons.length
        ? <div className='vz-component-preview-no-results'>
          <div className='vz-component-preview-no-results-image' />
          <div className={`vz-component-preview-no-results-text ${marginBottom20}`}>
            {`There were no icons found matching "${query}"`}
          </div>
        </div>
        : <>
          {icons.map(icon =>
            <DocsIcon
              icon={icon}
              selectedIcon={selectedIcon}
              handleSelectedIcon={handleSelectedIcon}
            />
          )}
        </>
      }
    </>
  );
});

const CodeBlocks = memo(({ selectedIcon }) => {
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
});

const Aside = memo(({ selectedIcon }) => {
  const { marginBottom20 } = getModule('marginBottom20');
  const { weightMedium } = getModule('weightMedium');
  const { size20 } = getModule('size24');
  return (
    <>
      {selectedIcon && <>
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
});

export default memo(() => {
  const [ selectedIcon, setSelectedIcon ] = useState(Icon.Names[0]);
  const [ query, setQuery ] = useState('');

  const handleSort = icons => {
    if (query && query !== '') {
      const search = query.toLowerCase();
      return icons
        .filter(icon => icon.toLowerCase().includes(search))
        .sort();
    }
    return icons.sort();
  };

  const handleQueryChange = query => {
    setQuery(query);
  };

  const handleSelectedIcon = icon => {
    setSelectedIcon(icon);
  };

  return (
    <Layout>
      <Content heading='Components' subheading='I like components and stuff'>
        <Section heading='Icons' subheading='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare tellus nec dapibus finibus. Nulla massa velit, mattis non eros a, interdum tristique massa. Curabitur mauris sem, porttitor quis ligula vitae, suscipit hendrerit quam. Nunc sit amet enim id elit vehicula tempus sed sed tellus. Aliquam felis turpis, malesuada ut tortor id, iaculis facilisis felis.'>
          <ComponentPreview
            preview={<Preview handleSort={handleSort} selectedIcon={selectedIcon} query={query} handleSelectedIcon={handleSelectedIcon} />}
            code={<CodeBlocks selectedIcon={selectedIcon} />}
            aside={<Aside selectedIcon={selectedIcon} />}
            tabBarChildren={<Search query={query} handleQueryChange={handleQueryChange} />}
          />
        </Section>
      </Content>
      <AsideNav type='Components' />
    </Layout>
  );
});
