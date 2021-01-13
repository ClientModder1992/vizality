import { promises, existsSync } from 'fs';
import { join } from 'path';
import React from 'react';

import { forceUpdateElement, getOwnerInstance } from '@vizality/util/react';
import { getModule, getModuleByDisplayName } from '@vizality/webpack';
import { Guild, Directories } from '@vizality/constants';
import { waitForElement } from '@vizality/util/dom';
import { patch, unpatch } from '@vizality/patcher';
import { Builtin } from '@vizality/entities';

import AnnouncementContainer from './components/AnnouncementContainer';
import ToastContainer from './components/ToastContainer';

const { unlink } = promises;

export default class Notices extends Builtin {
  start () {
    this.injectStyles('styles/main.scss');
    this._patchAnnouncements();
    this._patchToasts();

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
    patch('vz-notices-announcements', instance.__proto__, 'render', (_, res) => {
      res.props.children[1].props.children.unshift(
        <AnnouncementContainer />
      );
      return res;
    });

    instance.forceUpdate();
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

  async _welcomeNewUser () {
    const store = getModule('getGuilds');

    // @i18n
    vizality.api.notices.sendAnnouncement('vz-first-welcome', {
      color: 'green',
      message: 'Welcome! Vizality has been successfully injected into your Discord client. Feel free to visit our Discord server for announcements, support, and more!',
      button: {
        text: store.getGuilds(Guild.ID) ? 'Go to Server' : 'Join Server',
        onClick: () => {
          const inviteStore = getModule('acceptInviteAndTransitionToInviteChannel');
          inviteStore.acceptInviteAndTransitionToInviteChannel(Guild.INVITE);
          getModule('popLayer').popAllLayers();
        }
      }
    });
  }

  // @i18n
  _unsupportedBuild () {
    vizality.api.notices.sendAnnouncement('vz-unsupported-build', {
      color: 'orange',
      message: `Vizality does not support the ${window.GLOBAL_ENV.RELEASE_CHANNEL} release of Discord. Please use Stable for best results.`
    });
  }
}
