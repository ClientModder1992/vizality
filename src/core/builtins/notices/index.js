import { patch, unpatch } from '@vizality/patcher';
import Constants from '@vizality/constants';
import Entities from '@vizality/entities';
import Webpack from '@vizality/webpack';
import Util from '@vizality/util';
import React from 'react';
import path from 'path';
import fs from 'fs';

import NoticeContainer from './components/NoticeContainer';
import ToastContainer from './components/ToastContainer';

export default class Notifications extends Entities.Builtin {
  async start () {
    this.injectStyles('styles/main.scss');
    const injectedFile = path.join(Constants.Directories.SRC, '__injected.txt');
    await this._patchNotices();
    await this._patchToasts();
    if (fs.existsSync(injectedFile)) {
      this._welcomeNewUser();
      if (window.GLOBAL_ENV?.RELEASE_CHANNEL !== 'stable') {
        this._unsupportedBuild();
      }
      fs.promises.unlink(injectedFile);
    }
  }

  stop () {
    unpatch('vz-notices-notices');
    unpatch('vz-notices-toast');
  }

  /**
   * @todo Figure out how to forceUpdate the app initially to render startup notices.
   */
  async _patchNotices () {
    const { base } = Webpack.getModule('base', 'container');
    const instance = Util.react.getOwnerInstance(await Util.dom.waitForElement(`.${base.split(' ')[0]}`));
    patch('vz-notices-notices', instance?.props?.children, 'type', (_, res) => {
      try {
        res.props?.children[1]?.props?.children?.unshift(
          <NoticeContainer />
        );
      } catch (err) {
        return this.error(this._labels.concat('_patchNotices'), err);
      }
    });
  }

  /**
   * 
   */
  async _patchToasts () {
    const { app } = Webpack.getModule('app', 'layers');
    const Shakeable = Webpack.getModuleByDisplayName('Shakeable');
    patch('vz-notices-toast', Shakeable?.prototype, 'render', (_, res) => {
      try {
        if (!res.props?.children?.find(child => child.type?.name === 'ToastContainer')) {
          res.props?.children?.push(
            <ToastContainer settings={this.settings} />
          );
        }
      } catch (err) {
        return this.error(this._labels.concat('_patchToasts'), err);
      }
    });
    Util.react.forceUpdateElement(`.${app}`);
  }

  /**
   * 
   */
  _welcomeNewUser () {
    try {
      vizality.api.routes.navigateTo('home');
    } catch (err) {
      this.error(this._labels.concat('_welcomeNewUser'), err);
    }
  }

  // @i18n
  /**
   * 
   */
  _unsupportedBuild () {
    try {
      vizality.api.notifications.sendNotice({
        color: 'orange',
        message: `Vizality does not support the ${window.GLOBAL_ENV.RELEASE_CHANNEL} release of Discord. Please use Stable for best results.`
      });
    } catch (err) {
      this.error(this._labels.concat('_unsupportedBuild'), err);
    }
  }
}
