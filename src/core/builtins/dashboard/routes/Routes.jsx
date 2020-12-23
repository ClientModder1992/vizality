import React, { memo } from 'react';
import { Route, Switch, Redirect } from 'react-router';

import ImageCarouselModal from '../components/pages/screenshots/ImageCarouselModal';
import Markdown from '../components/pages/documentation/components/Markdown';
import Icons from '../components/pages/documentation/components/Icons';
import Screenshots from '../components/pages/screenshots/Screenshots';
import Changelog from '../components/pages/changelog/Changelog';
import ErrorTest from '../components/pages/ErrorTest';
import Content from '../components/parts/Content';
import Home from '../components/pages/home/Home';
import Layout from '../components/parts/Layout';
import Test from '../components/pages/Test';

import AddonList from '@vizality/builtins/addon-manager/components/addons/List';

export default memo(() => {
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
          <Layout>
            <Content heading='Table Testing'>
              <Test />
            </Content>
          </Layout>
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
