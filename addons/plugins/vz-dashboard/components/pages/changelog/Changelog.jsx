const { join } = require('path');

const { Directories } = require('@constants');
const { Markdown } = require('@components');
const { React } = require('@react');

const Content = require('../../parts/Content');
const Layout = require('../../parts/Layout');

const Changelog = join(Directories.ROOT, 'CHANGELOG.md');

module.exports = React.memo(() => {
  return (
    <Layout>
      <Content header='Changelog'>
        <Markdown source={Changelog} />
      </Content>
    </Layout>
  );
});
