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
import ToastContainer from './components/ToastContainer';

const { unlink } = promises;

export default class Notices extends Builtin {
  async start () {
    this.injectStyles('styles/main.scss');
    await this._patchAnnouncements();
    await this._patchToasts();

    const injectedFile = join(Directories.SRC, '__injected.txt');

    if (existsSync(injectedFile)) {
      this._welcomeNewUser();
      unlink(injectedFile);
    }

    if (window.GLOBAL_ENV.RELEASE_CHANNEL !== 'stable') {
      this._unsupportedBuild();
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
      return res;
    });
  }

  async _patchToasts () {
    const { app } = getModule('app', 'layers');
    const Shakeable = getModuleByDisplayName('Shakeable');
    patch('vz-notices-toast', Shakeable.prototype, 'render', (_, res) => {
      if (!res.props.children.find(child => child.type && child.type.name === 'ToastContainer')) {
        res.props.children.push(
          <ToastContainer />
        );
      }
      return res;
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
