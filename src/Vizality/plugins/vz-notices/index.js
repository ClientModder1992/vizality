const { resolve } = require('path');
const { existsSync } = require('fs');
const { unlink } = require('fs').promises;
const { Plugin } = require('vizality/entities');
const { React, getModule, getModuleByDisplayName, constants: { Routes } } = require('vizality/webpack');
const { forceUpdateElement, getOwnerInstance, waitFor } = require('vizality/util');
const { inject, uninject } = require('vizality/injector');
const { GUILD_ID, DISCORD_INVITE } = require('vizality/constants');

const ToastContainer = require('./components/ToastContainer');
const AnnouncementContainer = require('./components/AnnouncementContainer');

module.exports = class Notices extends Plugin {
  startPlugin () {
    this.loadStylesheet('style.scss');
    this._patchAnnouncements();
    this._patchToasts();

    const injectedFile = resolve(__dirname, '..', '..', '..', '__injected.txt');
    if (existsSync(injectedFile)) {
      this._welcomeNewUser();
      unlink(injectedFile);
    }

    if (window.GLOBAL_ENV.RELEASE_CHANNEL !== 'stable') {
      this._unsupportedBuild();
    }
  }

  pluginWillUnload () {
    uninject('vz-notices-announcements');
    uninject('vz-notices-toast');
  }

  async _patchAnnouncements () {
    const { base } = await getModule([ 'base', 'container' ]);
    const instance = getOwnerInstance(await waitFor(`.${base.split(' ')[0]}`));
    inject('vz-notices-announcements', instance.__proto__, 'render', (_, res) => {
      res.props.children[1].props.children.unshift(React.createElement(AnnouncementContainer));
      return res;
    });

    instance.forceUpdate();
  }

  async _patchToasts () {
    const { app } = await getModule([ 'app', 'layers' ]);
    const Shakeable = await getModuleByDisplayName('Shakeable');
    inject('vz-notices-toast', Shakeable.prototype, 'render', (_, res) => {
      if (!res.props.children.find(child => child.type && child.type.name === 'ToastContainer')) {
        res.props.children.push(React.createElement(ToastContainer));
      }
      return res;
    });
    forceUpdateElement(`.${app}`);
  }

  async _welcomeNewUser () {
    const store = await getModule([ 'getGuilds' ]);

    let alreadyJoined = false;

    if (store.getGuilds()[GUILD_ID]) {
      alreadyJoined = true;
    }

    this.sendAnnouncement('vz-first-welcome', {
      color: 'green',
      message: 'Welcome! Vizality has been successfully injected into your Discord client. Feel free to join our Discord server for announcements, support and more!',
      button: {
        text: alreadyJoined ? 'Go to Server' : 'Join Server',
        onClick: async () => {
          if (alreadyJoined) {
            const channel = await getModule([ 'getLastSelectedChannelId' ]);
            const router = await getModule([ 'transitionTo' ]);
            // eslint-disable-next-line new-cap
            router.transitionTo(Routes.CHANNEL(GUILD_ID, channel.getChannelId(GUILD_ID)));
          } else {
            const windowManager = await getModule([ 'flashFrame', 'minimize' ]);
            const { INVITE_BROWSER: { handler: popInvite } } = await getModule([ 'INVITE_BROWSER' ]);
            const oldMinimize = windowManager.minimize;
            windowManager.minimize = () => void 0;
            popInvite({ args: { code: DISCORD_INVITE } });
            windowManager.minimize = oldMinimize;
          }
        }
      }
    });
  }

  _unsupportedBuild () {
    this.sendAnnouncement('vz-unsupported-build', {
      color: 'orange',
      message: `Vizality does not support the ${window.GLOBAL_ENV.RELEASE_CHANNEL} release of Discord. Please use Stable for best results.`
    });
  }
};
