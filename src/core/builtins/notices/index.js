import { ToastContainer } from 'react-toastify';
import { promises, existsSync } from 'fs';
import { join } from 'path';
import React from 'react';

import { forceUpdateElement, getOwnerInstance } from '@vizality/util/react';
import { getModule, getModuleByDisplayName } from '@vizality/webpack';
import { waitForElement } from '@vizality/util/dom';
import { patch, unpatch } from '@vizality/patcher';
import { Directories } from '@vizality/constants';
import { Builtin } from '@vizality/entities';

import AnnouncementContainer from './components/AnnouncementContainer';

const { unlink } = promises;

export default class Notices extends Builtin {
  async start () {
    this.injectStyles('styles/main.scss');
    const injectedFile = join(Directories.SRC, '__injected.txt');
    await this._patchAnnouncements();
    await this._patchToasts();
    if (existsSync(injectedFile)) {
      this._welcomeNewUser();
      if (window.GLOBAL_ENV.RELEASE_CHANNEL !== 'stable') {
        this._unsupportedBuild();
      }
      unlink(injectedFile);
    }
  }

  stop () {
    unpatch('vz-notices-announcements');
    unpatch('vz-notices-toast');
  }

  async _patchAnnouncements () {
    const { base } = getModule('base', 'container');
    const instance = getOwnerInstance(await waitForElement(`.${base.split(' ')[0]}`));
    patch('vz-notices-announcements', instance.props.children, 'type', (_, res) => {
      res.props.children[1].props.children.unshift(
        <AnnouncementContainer />
      );
    });
  }

  async _patchToasts () {
    const { app } = getModule('app', 'layers');
    const Shakeable = getModuleByDisplayName('Shakeable');
    patch('vz-notices-toast', Shakeable.prototype, 'render', (_, res) => {
      if (!res.props.children.find(child => child.type && child.type.name === 'ToastContainer')) {
        res.props.children.push(
          <ToastContainer
            className='vz-toast-container'
            closeOnClick={false}
            pauseOnFocusLoss={false}
            autoClose={false}
            draggable={false}
          />
        );
      }
    });
    forceUpdateElement(`.${app}`);
  }

  _welcomeNewUser () {
    vizality.api.routes.navigateTo('home');
  }

  // @i18n
  _unsupportedBuild () {
    vizality.api.notices.sendAnnouncement('vz-unsupported-build', {
      color: 'orange',
      message: `Vizality does not support the ${window.GLOBAL_ENV.RELEASE_CHANNEL} release of Discord. Please use Stable for best results.`
    });
  }
}
