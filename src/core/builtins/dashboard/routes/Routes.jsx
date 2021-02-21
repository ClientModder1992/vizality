import { Route, Switch, Redirect } from 'react-router';
import React, { memo } from 'react';

import ImageCarouselModal from '../pages/screenshots/ImageCarouselModal';
import Markdown from '../pages/docs/components/Markdown';
import Screenshots from '../pages/screenshots/Screenshots';
import Changelog from '../pages/changelog/Changelog';
import Icons from '../pages/docs/components/Icons';
import Content from '../components/parts/Content';
import Layout from '../components/parts/Layout';
import ErrorTest from '../pages/ErrorTest';
import Home from '../pages/home/Home';
import Test2 from '../pages/Test2';
import Test from '../pages/Test';

import AddonList from '@vizality/builtins/addon-manager/components/addons/List';

export default memo(() => {
  return (
    <>
      <Switch>
        <Redirect from='/vizality' to='/vizality/home' exact />
        <Redirect from='/vizality/docs' to='/vizality/docs/getting-started' exact />
      </Switch>
      <Switch>
        <Route path='/vizality/home' exact>
          <Home />
        </Route>
        <Route path='/vizality/plugins' exact>
          <Layout>
            <Content
              heading='Plugins'
              subheading='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare tellus nec dapibus finibus. Nulla massa velit, mattis non eros a, interdum tristique massa. Curabitur mauris sem, porttitor quis ligula vitae, suscipit hendrerit quam. Nunc sit amet enim id elit vehicula tempus sed sed tellus. Aliquam felis turpis, malesuada ut tortor id, iaculis facilisis felis.'
              icon='Plugin'
            >
              <AddonList type='plugin' tab='installed' />
            </Content>
          </Layout>
        </Route>
        <Route path='/vizality/plugins/discover' exact>
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
        <Route path='/vizality/themes' exact>
          <Layout>
            <Content
              heading='Themes'
              subheading='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare tellus nec dapibus finibus. Nulla massa velit, mattis non eros a, interdum tristique massa. Curabitur mauris sem, porttitor quis ligula vitae, suscipit hendrerit quam. Nunc sit amet enim id elit vehicula tempus sed sed tellus. Aliquam felis turpis, malesuada ut tortor id, iaculis facilisis felis.'
              icon='Theme'
            >
              <AddonList type='theme' tab='installed' />
            </Content>
          </Layout>
        </Route>
        <Route path='/vizality/themes/discover' exact>
          <Layout>
            <Content
              heading='Themes'
              subheading='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare tellus nec dapibus finibus. Nulla massa velit, mattis non eros a, interdum tristique massa. Curabitur mauris sem, porttitor quis ligula vitae, suscipit hendrerit quam. Nunc sit amet enim id elit vehicula tempus sed sed tellus. Aliquam felis turpis, malesuada ut tortor id, iaculis facilisis felis.'
              icon='Theme'
            >
              <AddonList type='theme' tab='discover' />
            </Content>
          </Layout>
        </Route>
        <Route path='/vizality/theme-editor' exact>
          <Layout>
            <Content
              heading='Theme Editor'
              subheading='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare tellus nec dapibus finibus. Nulla massa velit, mattis non eros a, interdum tristique massa. Curabitur mauris sem, porttitor quis ligula vitae, suscipit hendrerit quam. Nunc sit amet enim id elit vehicula tempus sed sed tellus. Aliquam felis turpis, malesuada ut tortor id, iaculis facilisis felis.'
              icon='Settings'
            >
            </Content>
          </Layout>
        </Route>
        <Route path='/vizality/developers' exact>
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
        <Route path='/vizality/docs/components/screenshots' exact>
          <Layout>
            <Content heading='Screenshots' className='vz-addon-screenshots'>
              <Screenshots />
            </Content>
          </Layout>
        </Route>
        <Route path='/vizality/docs/components/icons' exact>
          <Icons selectedTab='PREVIEW' />
        </Route>
        <Route path='/vizality/docs/components/markdown' exact>
          <Markdown />
        </Route>
        {/* <Route path='/vizality/docs/components/test' exact>
          <Icons selectedTab='CODE' />
        </Route> */}
        <Route path='/vizality/docs/components/error-test' exact>
          <ErrorTest />
        </Route>
        <Route path='/vizality/docs/components/test' exact>
          <Layout>
            <Content heading='Table Testing'>
              <Test />
            </Content>
          </Layout>
        </Route>
        <Route path='/vizality/docs/components/test2' exact>
          <Layout>
            <Content>
              <Test2 />
            </Content>
          </Layout>
        </Route>
        <Route path='/vizality/changelog' exact>
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
