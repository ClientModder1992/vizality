const { React, Router: { Route, Switch, Redirect } } = require('@webpack');

const Icons = require('../components/pages/documentation/components/Icons');
const Screenshots = require('../components/pages/screenshots/Screenshots');
const Changelog = require('../components/pages/changelog/Changelog');
const Updates = require('../../vz-updater/components/Settings');
const Content = require('../components/parts/Content');
const Home = require('../components/pages/home/Home');
const Layout = require('../components/parts/Layout');
const Test = require('../components/pages/Test');

const Plugins = require('@root/addons/plugins/vz-addon-manager/components/manage/Plugins');
const Themes = require('@root/addons/plugins/vz-addon-manager/components/manage/Themes');
const Settings = require('@root/addons/plugins/vz-settings/components/Settings');

const basePath = '/_vizality/dashboard';

module.exports = () => {
  return (
    <Switch>
      <Redirect from={basePath} to={`${basePath}/home`} exact />
      <Redirect from={`${basePath}/documentation`} to={`${basePath}/documentation/getting-started`} exact />

      <Route path={`${basePath}/home`} exact>
        <Home />
      </Route>
      <Route path={`${basePath}/settings`} exact>
        <Layout>
          <Content header='Settings'>
            <Settings />
          </Content>
        </Layout>
      </Route>
      <Route path={`${basePath}/plugins`} exact>
        <Layout isFullWidth>
          <Content header='Plugins' icon='Plugin' hasBackground>
            <Plugins />
          </Content>
        </Layout>
      </Route>
      <Route path={`${basePath}/plugins/discover`} exact>
        <Layout>
          <Content header='Plugins'>
            <Plugins tab='DISCOVER' />
          </Content>
        </Layout>
      </Route>
      <Route path={`${basePath}/themes`} exact>
        <Layout isFullWidth>
          <Content header='Themes' icon='Theme' hasBackground>
            <Themes />
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
      {/* <Route path={`${basePath}/documentation/components/test`} exact>
        <Icons selectedTab='CODE' />
      </Route> */}
      <Route path={`${basePath}/documentation/components/test`} exact>
        <Test />
      </Route>
      <Route path={`${basePath}/experiments`} exact>
        <Layout />
      </Route>
      <Route path={`${basePath}/updates`} exact>
        <Layout>
          <Content header='Updates'>
            <Updates />
          </Content>
        </Layout>
      </Route>
      <Route path={`${basePath}/changelog`} exact>
        <Layout>
          <Content header='Changelog'>
            <Changelog />
          </Content>
        </Layout>
      </Route>
    </Switch>
  );
};
