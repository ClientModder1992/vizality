const { React, Router: { Route, Switch, Redirect } } = require('@vizality/react');

const Markdown = require('../components/pages/documentation/components/Markdown');
const Icons = require('../components/pages/documentation/components/Icons');
const ImageCarouselModal = require('../components/pages/screenshots/ImageCarouselModal');
const Screenshots = require('../components/pages/screenshots/Screenshots');
const Changelog = require('../components/pages/changelog/Changelog');
const ErrorTest = require('../components/pages/ErrorTest');
const Content = require('../components/parts/Content');
const Home = require('../components/pages/home/Home');
const Layout = require('../components/parts/Layout');
const Test = require('../components/pages/Test');

const AddonList = require('@vizality/builtins/addon-manager/components/addons/List');
const Snippets = require('@vizality/builtins/snippet-manager/components/CustomCSS');

module.exports = React.memo(() => {
  return (
    <>
      <Switch>
        <Redirect from='/vizality/dashboard' to='/vizality/dashboard/home' exact />
        <Redirect from='/vizality/dashboard/documentation' to='/vizality/dashboard/documentation/getting-started' exact />
      </Switch>
      <Switch>
        <Route path='/vizality/dashboard/home' exact>
          <Home />
        </Route>
        <Route path='/vizality/dashboard/plugins' exact>
          <Layout>
            <Content
              heading='Plugins'
              subheading='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare tellus nec dapibus finibus. Nulla massa velit, mattis non eros a, interdum tristique massa. Curabitur mauris sem, porttitor quis ligula vitae, suscipit hendrerit quam. Nunc sit amet enim id elit vehicula tempus sed sed tellus. Aliquam felis turpis, malesuada ut tortor id, iaculis facilisis felis.'
              icon='Plugin'
            >
              <AddonList type='plugin' />
            </Content>
          </Layout>
        </Route>
        <Route path='/vizality/dashboard/plugins/discover' exact>
          <Layout>
            <Content
              heading='Plugins'
              subheading='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare tellus nec dapibus finibus. Nulla massa velit, mattis non eros a, interdum tristique massa. Curabitur mauris sem, porttitor quis ligula vitae, suscipit hendrerit quam. Nunc sit amet enim id elit vehicula tempus sed sed tellus. Aliquam felis turpis, malesuada ut tortor id, iaculis facilisis felis.'
              icon='Plugin'
            >
              <AddonList type='plugin' tab='discover' />
            </Content>
          </Layout>
        </Route>
        {/* <Route path='/vizality/dashboard/themes' exact>
          <Layout isFullWidth>
            <Content header='Themes' icon='Theme' hasBackground>
              <Themes />
            </Content>
          </Layout>
        </Route> */}
        <Route path='/vizality/dashboard/themes' exact>
          <Layout>
            <Content
              heading='Themes'
              subheading='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare tellus nec dapibus finibus. Nulla massa velit, mattis non eros a, interdum tristique massa. Curabitur mauris sem, porttitor quis ligula vitae, suscipit hendrerit quam. Nunc sit amet enim id elit vehicula tempus sed sed tellus. Aliquam felis turpis, malesuada ut tortor id, iaculis facilisis felis.'
              icon='Theme'
            >
              <AddonList type='theme' />
            </Content>
          </Layout>
        </Route>
        <Route path='/vizality/dashboard/theme-editor' exact>
          <Layout>
            <Content
              heading='Theme Editor'
              subheading='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare tellus nec dapibus finibus. Nulla massa velit, mattis non eros a, interdum tristique massa. Curabitur mauris sem, porttitor quis ligula vitae, suscipit hendrerit quam. Nunc sit amet enim id elit vehicula tempus sed sed tellus. Aliquam felis turpis, malesuada ut tortor id, iaculis facilisis felis.'
              icon='Settings'
            >
            </Content>
          </Layout>
        </Route>
        <Route path='/vizality/dashboard/developers' exact>
          <Layout>
            <Content
              heading='Developers'
              subheading='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare tellus nec dapibus finibus. Nulla massa velit, mattis non eros a, interdum tristique massa. Curabitur mauris sem, porttitor quis ligula vitae, suscipit hendrerit quam. Nunc sit amet enim id elit vehicula tempus sed sed tellus. Aliquam felis turpis, malesuada ut tortor id, iaculis facilisis felis.'
              icon='UnknownUser'
              className='vz-addon-screenshots'
            >
              <ImageCarouselModal />
            </Content>
          </Layout>
        </Route>
        <Route path='/vizality/dashboard/documentation/components/screenshots' exact>
          <Layout>
            <Content heading='Screenshots' className='vz-addon-screenshots'>
              <Screenshots />
            </Content>
          </Layout>
        </Route>
        <Route path='/vizality/dashboard/documentation/components/icons' exact>
          <Icons selectedTab='PREVIEW' />
        </Route>
        <Route path='/vizality/dashboard/documentation/components/markdown' exact>
          <Markdown />
        </Route>
        {/* <Route path='/vizality/dashboard/documentation/components/test' exact>
          <Icons selectedTab='CODE' />
        </Route> */}
        <Route path='/vizality/dashboard/documentation/components/error-test' exact>
          <ErrorTest />
        </Route>
        <Route path='/vizality/dashboard/documentation/components/test' exact>
          <Test />
        </Route>
        {/* <Route path='/vizality/dashboard/updater' exact>
          <Layout>
            <Content
              heading='Updater'
              subheading='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare tellus nec dapibus finibus. Nulla massa velit, mattis non eros a, interdum tristique massa. Curabitur mauris sem, porttitor quis ligula vitae, suscipit hendrerit quam. Nunc sit amet enim id elit vehicula tempus sed sed tellus. Aliquam felis turpis, malesuada ut tortor id, iaculis facilisis felis.'
              icon='CloudDownload'
            >
              <Updater />
            </Content>
          </Layout>
        </Route> */}
        <Route path='/vizality/dashboard/changelog' exact>
          <Layout>
            <Content
              heading='Changelog'
              subheading='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare tellus nec dapibus finibus. Nulla massa velit, mattis non eros a, interdum tristique massa. Curabitur mauris sem, porttitor quis ligula vitae, suscipit hendrerit quam. Nunc sit amet enim id elit vehicula tempus sed sed tellus. Aliquam felis turpis, malesuada ut tortor id, iaculis facilisis felis.'
              icon='ClockReverse'
            >
              <Changelog />
            </Content>
          </Layout>
        </Route>
      </Switch>
    </>
  );
});
