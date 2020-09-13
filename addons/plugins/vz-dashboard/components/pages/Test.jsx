const { Icon, CodeBlock, Tooltip, ComponentPreview, settings: { TextInput } } = require('@components');
const { React, React: { useState, useEffect } } = require('@react');
const { joinClassNames } = require('@util');
const { getModule } = require('@webpack');

const Section = require('../parts/Section');
const Content = require('../parts/Content');
const Layout = require('../parts/Layout');
const Aside = require('../parts/Aside');

module.exports = React.memo(() => {
  const Icons = Icon.Names;
  const [ selectedIcon, setSelectedIcon ] = useState('');
  const [ iconList, setIconList ] = useState(Icons);
  const [ search, setSearch ] = useState('');
  const [ hasSearchResults, setHasSearchResults ] = useState(true);
  const { marginBottom20 } = getModule('marginBottom20');
  const { weightMedium } = getModule('weightMedium');
  const { size20 } = getModule('size24');

  useEffect(() => {
    const iconList = Icons.map(name => {
      if (!search || (search && name.toLowerCase().includes(search.toLowerCase()))) {
        return <Icon name={name} tooltip={name} className={joinClassNames('vz-docs-components-icons-icon-wrapper', { 'vz-is-active': name === selectedIcon })} iconClassName='vz-docs-components-icons-icon' onClick={() => setSelectedIcon(name)} />;
      }
      return false;
    });
    setIconList(iconList);
  }, [ search, selectedIcon ]);

  const renderSearch = () => {
    return (
      <TextInput
        title='pie'
        note='poo'
        required={true}
        className='poop-test'
        value={search}
        onChange={search => {
          setSearch(search);
          setHasSearchResults(Icons.filter(f => f.toLowerCase().includes(search)).length > 0);
        }}
        placeholder='Search icons...'
      />
    );
  };

  const renderAside = () => {
    return (
      <>
        {hasSearchResults && selectedIcon && <>
          <div className={`vz-docs-components-icons-aside-icon-name ${size20} ${marginBottom20} ${weightMedium}`}>
            {selectedIcon}
          </div>
          <Icon name={selectedIcon} width={'100%'} height={'100%'} className='vz-docs-components-icons-aside-icon-wrapper' />
        </>}
      </>
    );
  };

  const renderCodeTab = () => {
    return (
      <>
        <CodeBlock language='js' header='JSX' content={
          `const { Icon } = require('@components');\n\n` +
          `<Icon name='${selectedIcon}' />`}
        />
        <CodeBlock language='js' header='React' content={
          `const { Icon } = require('@components');\n\n` +
          `React.createElement(Icon, {\n` +
          `  name: '${selectedIcon}'\n` +
          `});`}
        />
      </>
    );
  };

  const renderPreviewTab = () => {
    return (
      <>
        {iconList}
        {!hasSearchResults && <div className='vz-component-preview-no-results'>
          <div className='vz-component-preview-no-results-image' />
          <div className={`vz-component-preview-no-results-text ${marginBottom20}`}>
            {/* @i18n */}
            {`There were no icons found matching '${search}'`}
          </div>
        </div>}
      </>
    );
  };

  return (
    <Layout>
      <Content header='Components' subtext='I like components and stuff'>
        <Section header='Icons' subtext='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare tellus nec dapibus finibus. Nulla massa velit, mattis non eros a, interdum tristique massa. Curabitur mauris sem, porttitor quis ligula vitae, suscipit hendrerit quam. Nunc sit amet enim id elit vehicula tempus sed sed tellus. Aliquam felis turpis, malesuada ut tortor id, iaculis facilisis felis.'>
          <ComponentPreview
            aside={renderAside()}
            tabsChildren={renderSearch()}
            previewTabChildren={renderPreviewTab()}
            codeTabChildren={renderCodeTab()}
          />
        </Section>
      </Content>
      <Aside type='Components' />
    </Layout>
  );
});
