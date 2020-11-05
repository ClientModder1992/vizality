const { React } = require('@vizality/react');

const Section = require('../../parts/Section');
const Content = require('../../parts/Content');
const Layout = require('../../parts/Layout');
const Features = require('./Features');
const CTA = require('./CTA');

module.exports = React.memo(() => {
  return (
    <Layout className='vizality-dashboard-page-home' isFullWidth>
      <Content>
        <Section className='cta'>
          <CTA />
        </Section>
        <Section className='features' hasPadding>
          <Features />
        </Section>
      </Content>
    </Layout>
  );
});
