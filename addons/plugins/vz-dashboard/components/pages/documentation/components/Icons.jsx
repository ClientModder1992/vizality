const { Icon, Tooltip, TabBar, settings: { TextInput } } = require('@components');
const { React, React: { useState, useEffect } } = require('@react');
const { joinClassNames } = require('@utilities');
const { getModule } = require('@webpack');

const Codeblock = require('../../../parts/Codeblock');
const Section = require('../../../parts/Section');
const Content = require('../../../parts/Content');
const Layout = require('../../../parts/Layout');
const Aside = require('../../../parts/Aside');

module.exports = React.memo(({ selectedTab }) => {
  const [ tab, setTab ] = useState(selectedTab);
  const [ iconName, setIcon ] = useState('');
  const [ search, setSearch ] = useState('');
  const [ hasSearchResults, setHasSearchResults ] = useState(true);

  const { size20 } = getModule('size24');
  const { marginBottom20 } = getModule('marginBottom20');
  const { weightMedium } = getModule('weightMedium');

  useEffect(() => {
    if (!selectedTab || selectedTab === 'PREVIEW') setTab('PREVIEW');
    else if (selectedTab === 'CODE') setTab('CODE');
  }, [ selectedTab ]);

  const renderSearch = () => {
    return (
      <TextInput
        className='poop-test'
        value={search}
        onChange={search => {
          setSearch(search);
          setHasSearchResults(Icon.Names.filter(f => f.toLowerCase().includes(search)).length > 0);
        }}
        placeholder='Search icons...'
        disabled={tab === 'CODE'}
      />
    );
  };

  const renderTabs = () => {
    const { topPill, item } = getModule('topPill');
    return (
      <>
        <div className='vizality-entities-manage-tabs'>
          <TabBar
            selectedItem={tab}
            onItemSelect={tab => setTab(tab)}
            type={topPill}
          >
            <TabBar.Item className={item} selectedItem={tab} id='PREVIEW'>
              Preview
            </TabBar.Item>
            {hasSearchResults && <TabBar.Item className={item} selectedItem={tab} id='CODE'>
              Code
            </TabBar.Item>}
          </TabBar>
          {renderSearch()}
        </div>
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
          {renderTabs()}
          <div className={joinClassNames(`poop-div ${tab.toLowerCase()}`)}>
            {hasSearchResults && iconName && <div className='vizality-component-preview-aside'>
              <div className={`vizality-demo-large-icon-name ${size20} ${marginBottom20} ${weightMedium}`}>{iconName}</div>
              <div className='vizality-icon-wrapper vizality-demo-large-icon-wrapper'>
                <Icon className='vizality-icon' name={iconName} width={'100%'} height={'100%'} />
              </div>
            </div>}
            <div className='some-div'>
              {tab === 'PREVIEW' && <>
                {renderContent()}
              </>}
              {tab === 'CODE' && <>
                <Codeblock type='JSX' content={`<Icon name='${iconName}' />`} />
                <Codeblock type='React' content={
                  `React.createElement(Icon, {\n` +
                  `  name: '${iconName}'\n` +
                  `});`}
                />
              </>}
            </div>
          </div>
        </Section>
      </Content>
      <Aside type='Components' />
    </Layout>
  );
});
