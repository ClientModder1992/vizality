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

    vizality.api.notices.sendAnnouncement('vz-first-welcome', {
      color: 'green',
      message: 'Welcome! Vizality has been successfully injected into your Discord client. Feel free to join our Discord server for announcements, support and more!',
      button: {
        text: store.getGuilds(GUILD_ID) ? 'Go to Server' : 'Join Server',
        onClick: async () => {
          const inviteStore = await getModule([ 'acceptInviteAndTransitionToInviteChannel' ]);
          inviteStore.acceptInviteAndTransitionToInviteChannel(DISCORD_INVITE);
          (await getModule([ 'popLayer' ])).popAllLayers();
        }
      }
    });
  }

  _unsupportedBuild () {
    vizality.api.notices.sendAnnouncement('vz-unsupported-build', {
      color: 'orange',
      message: `Vizality does not support the ${window.GLOBAL_ENV.RELEASE_CHANNEL} release of Discord. Please use Stable for best results.`
    });
  }
};
