const { Markdown, CodeBlock, Icon, Tooltip, ComponentPreview } = require('@components');
const { React, React: { useState, useEffect } } = require('@react');
const { joinClassNames } = require('@util');
const { getModule } = require('@webpack');

const Section = require('../parts/Section');
const Content = require('../parts/Content');
const Layout = require('../parts/Layout');
const Aside = require('../parts/Aside');

module.exports = React.memo(({ selectedTab }) => {
  const [ tab, setTab ] = useState(selectedTab);
  const [ iconName, setIcon ] = useState('');
  const [ search, setSearch ] = useState('');
  const [ hasSearchResults, setHasSearchResults ] = useState(true);

  useEffect(() => {
    if (!selectedTab || selectedTab === 'PREVIEW') setTab('PREVIEW');
    else if (selectedTab === 'CODE') setTab('CODE');
  }, [ selectedTab ]);

  const renderAside = () => {
    const { marginBottom20 } = getModule('marginBottom20');
    const { size20 } = getModule('size24');
    const { weightMedium } = getModule('weightMedium');

    return (
      <>
        {hasSearchResults && iconName && <>
          <div className={`vizality-demo-large-icon-name ${size20} ${marginBottom20} ${weightMedium}`}>{iconName}</div>
          <div className='vizality-icon-wrapper vizality-demo-large-icon-wrapper'>
            <Icon className='vizality-icon' name={iconName} width={'100%'} height={'100%'} />
          </div>
        </>}
      </>
    );
  };

  const renderContent = () => {
    const { marginBottom20 } = getModule('marginBottom20');

    return (
      <>
        {/* eslint-disable-next-line array-callback-return */}
        {Icon.Names.map(name => {
          if (!search || (search && name.toLowerCase().includes(search.toLowerCase()))) {
            return (
              <div
                onClick={() => setIcon(name)}
                className={joinClassNames('vizality-icon-wrapper', 'vizality-demo-icon-wrapper', { active: iconName === name })}
              >
                <Tooltip text={name} position='top'>
                  <Icon className='vizality-demo-icon' name={name} />
                </Tooltip>
              </div>
            );
          }
        })}
        {!hasSearchResults && <div className='vizality-dashboard-section-no-results'>
          <div className='vizality-dashboard-section-no-results-image'></div>
          <div className={`vizality-dashboard-section-no-results-text ${marginBottom20}`}>
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
          <ComponentPreview selectedTab='CODE' asideChildren={renderAside()} previewTabChildren={renderContent()} codeTabChildren={
            <>
              <CodeBlock language='js' header='JSX' content={`<Icon name='${iconName}' />`} />
              <CodeBlock language='js' header='React' content={
                `React.createElement(Icon, {\n` +
                `  name: '${iconName}'\n` +
                `});`} />
            </>}
          />
        </Section>
        <Section header='Testing Stuff' subtext='asdasdad'>
          <div>Testing whewfheh whfwhjef wjhefjhw hjefwhjef hjwef</div>
        </Section>
      </Content>
      <Aside type='Components' />
    </Layout>
  );
});
