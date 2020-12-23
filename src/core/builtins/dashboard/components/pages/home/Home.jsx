import React, { memo } from 'react';

// import Section from '../../parts/Section';
// import Content from '../../parts/Content';
// import Layout from '../../parts/Layout';
// import Features from './Features';
// import CTA from './CTA';

export default memo(() => {
  return <></>;
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
