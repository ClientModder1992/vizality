import React, { memo } from 'react';

import Section from '../parts/Section';
import Content from '../parts/Content';
import Layout from '../parts/Layout';

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
