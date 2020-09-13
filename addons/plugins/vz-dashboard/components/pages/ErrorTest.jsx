const { React } = require('@react');

const Section = require('../parts/Section');
const Content = require('../parts/Content');
const Layout = require('../parts/Layout');

module.exports = React.memo(() => {
  return (
    <Layout>
      <Content header='Error Test'>
        <Section>
          {new Error()}
        </Section>
      </Content>
    </Layout>
  );
});
