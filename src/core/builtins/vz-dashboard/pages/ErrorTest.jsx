import React, { memo } from 'react';

import Section from '../components/parts/Section';
import Content from '../components/parts/Content';
import Layout from '../components/parts/Layout';

export default memo(() => {
  return (
    <Layout>
      <Content heading='Error Test'>
        <Section>
          {new Error()}
        </Section>
      </Content>
    </Layout>
  );
});
