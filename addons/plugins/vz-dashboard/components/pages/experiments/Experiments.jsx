const { getModuleByDisplayName } = require('@webpack');
const { React } = require('@react');

const Content = require('../../parts/Content');
const Layout = require('../../parts/Layout');

const DiscordExperiments = getModuleByDisplayName('UserSettingsExperiments');

module.exports = React.memo(() => {
  return (
    <Layout>
      <Content header='Experiments'>
        <DiscordExperiments />
      </Content>
    </Layout>
  );
});
