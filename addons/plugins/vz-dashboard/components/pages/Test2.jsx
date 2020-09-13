const { Icon2, CodeBlock, Tooltip, ComponentPreview, settings: { TextInput } } = require('@components');
const { React, React: { useState } } = require('@react');
const { joinClassNames } = require('@util');
const { getModule } = require('@webpack');

const Section = require('../parts/Section');
const Content = require('../parts/Content');
const Layout = require('../parts/Layout');
const Aside = require('../parts/Aside');

module.exports = () => {
  const [ iconName, setIconName ] = useState('');
  const [ search, setSearch ] = useState('');
  const [ hasSearchResults, setHasSearchResults ] = useState(true);
  const { marginBottom20 } = getModule('marginBottom20');
  const { weightMedium } = getModule('weightMedium');
  const { size20 } = getModule('size24');
  const Icons = Icon2.Names;

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
        {hasSearchResults && iconName && <>
          <div className={`vz-docs-components-icons-aside-icon-name ${size20} ${marginBottom20} ${weightMedium}`}>{iconName}</div>
          <div className='vz-icon-wrapper vz-docs-components-icons-aside-icon-wrapper'>
            <Icon2 name={iconName} width={'100%'} height={'100%'} />
          </div>
        </>}
      </>
    );
  };

  const renderCodeTab = () => {
    return (
      <>
        <CodeBlock language='js' header='JSX' content={
          `const { Icon } = require('@components');\n\n` +
          `<Icon name='${iconName}' />`}
        />
        <CodeBlock language='js' header='React' content={
          `const { Icon } = require('@components');\n\n` +
          `React.createElement(Icon, {\n` +
          `  name: '${iconName}'\n` +
          `});`}
        />
      </>
    );
  };

  const renderPreviewTab = () => {
    return (
      <>
        {/* eslint-disable-next-line array-callback-return */}
        {Icons.map(name => {
          if (!search || (search && name.toLowerCase().includes(search.toLowerCase()))) {
            return (
              <Icon2
                showBadge
                className='vz-docs-components-icons-icon'
                tooltip={name}
                tooltipPosition='top'
                name={name}
                onClick={() => {
                  console.log('test-poopheh');
                  setIconName(name);
                }}
              />
            );
          }
        })}
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
};
