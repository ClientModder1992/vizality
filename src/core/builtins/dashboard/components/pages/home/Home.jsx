const { React } = require('@vizality/react');

const Section = require('../../parts/Section');
const Content = require('../../parts/Content');
const Layout = require('../../parts/Layout');
const Features = require('./Features');
const CTA = require('./CTA');

module.exports = React.memo(() => {
  return (
    <Layout className='vz-dashboard-home'>
      <Content>
        <Section className='vz-dashboard-home-section-cta'>
          <CTA />
        </Section>
        <Section className='vz-dashboard-home-section-features'>
          <Features />
        </Section>
      </Content>
    </Layout>
  );
});
