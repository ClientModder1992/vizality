import React, { memo } from 'react';

import Section from '../../components/parts/Section';
import Content from '../../components/parts/Content';
import Layout from '../../components/parts/Layout';
import Features from './Features';
import CTA from './CTA';

export default memo(() => {
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
