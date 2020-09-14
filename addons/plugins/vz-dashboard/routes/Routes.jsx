const { React, Router: { Route, Switch, Redirect } } = require('@react');

const Markdown = require('../components/pages/documentation/components/Markdown');
const Icons = require('../components/pages/documentation/components/Icons');
const Experiments = require('../components/pages/experiments/Experiments');
const Screenshots = require('../components/pages/screenshots/Screenshots');
const Changelog = require('../components/pages/changelog/Changelog');
const Updates = require('../../vz-updater/components/Settings');
const ErrorTest = require('../components/pages/ErrorTest');
const Content = require('../components/parts/Content');
const Home = require('../components/pages/home/Home');
const Layout = require('../components/parts/Layout');
const Test = require('../components/pages/Test');

const Plugins = require('@root/addons/plugins/vz-addon-manager/components/manage/Plugins');
const Themes = require('@root/addons/plugins/vz-addon-manager/components/manage/Themes');
// const Settings = require('@root/addons/plugins/vz-settings/components/Settings');
// const Settings = vizality.api.settings.tabs['vz-settings'].render;

const basePath = '/vizality/dashboard';

module.exports = () => {
  return (
    <Switch>
      <Redirect from={basePath} to={`${basePath}/home`} exact />
      <Redirect from={`${basePath}/documentation`} to={`${basePath}/documentation/getting-started`} exact />

      <Route path={`${basePath}/home`} exact>
        <Home />
      </Route>
      {/* <Route path={`${basePath}/settings`} exact>
        <Settings />
      </Route> */}
      {/* <Route path={`${basePath}/plugins`} exact>
        <Layout isFullWidth>
          <Content header='Plugins' icon='Plugin' hasBackground>
            <Plugins />
          </Content>
        </Layout>
      </Route> */}
      <Route path={`${basePath}/plugins`} exact>
        <Layout>
          <Content header='Plugins'>
            <Plugins />
          </Content>
        </Layout>
      </Route>
      <Route path={`${basePath}/plugins/discover`} exact>
        <Plugins tab='DISCOVER' />
      </Route>
      {/* <Route path={`${basePath}/themes`} exact>
        <Layout isFullWidth>
          <Content header='Themes' icon='Theme' hasBackground>
            <Themes />
          </Content>
        </Layout>
      </Route> */}
      <Route path={`${basePath}/themes`} exact>
        <Layout>
          <Content header='Themes'>
            <Plugins />
          </Content>
        </Layout>
      </Route>
      <Route path={`${basePath}/snippets`} exact>
        <Layout />
      </Route>
      <Route path={`${basePath}/theme-editor`} exact>
        <Layout />
      </Route>
      <Route path={`${basePath}/developers`} exact>
        <Layout />
      </Route>
      <Route path={`${basePath}/documentation/components/screenshots`} exact>
        <Screenshots />
      </Route>
      <Route path={`${basePath}/documentation/components/icons`} exact>
        <Icons selectedTab='PREVIEW' />
      </Route>
      <Route path={`${basePath}/documentation/components/markdown`} exact>
        <Markdown />
      </Route>
      {/* <Route path={`${basePath}/documentation/components/test`} exact>
        <Icons selectedTab='CODE' />
      </Route> */}
      <Route path={`${basePath}/documentation/components/error-test`} exact>
        <ErrorTest />
      </Route>
      <Route path={`${basePath}/documentation/components/test`} exact>
        <Test />
      </Route>
      <Route path={`${basePath}/experiments`} exact>
        <Experiments />
      </Route>
      <Route path={`${basePath}/updates`} exact>
        <Layout>
          <Content header='Updates'>
            <Updates />
          </Content>
        </Layout>
      </Route>
      <Route path={`${basePath}/changelog`} exact>
        <Changelog />
      </Route>
    </Switch>
  );
};
