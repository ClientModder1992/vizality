const { react: { forceUpdateElement, getOwnerInstance }, dom: { waitForElement } } = require('@util');
const { React, getModule, getModuleByDisplayName } = require('@webpack');
const { GUILD_ID, INVITE_CODE, ROOT_FOLDER } = require('@constants');
const { patch, unpatch } = require('@patcher');
const { Plugin } = require('@entities');

const { promises: { unlink }, existsSync } = require('fs');
const { resolve } = require('path');

const AnnouncementContainer = require('./components/AnnouncementContainer');
const ToastContainer = require('./components/ToastContainer');

class Notices extends Plugin {
  startPlugin () {
    this.loadStylesheet('scss/style.scss');
    this._patchAnnouncements();
    this._patchToasts();

    const injectedFile = resolve(ROOT_FOLDER, 'src', '__injected.txt');

    if (existsSync(injectedFile)) {
      this._welcomeNewUser();
      unlink(injectedFile);
    }

    if (window.GLOBAL_ENV.RELEASE_CHANNEL !== 'stable') {
      this._unsupportedBuild();
    }
  }

  pluginWillUnload () {
    unpatch('vz-notices-announcements');
    unpatch('vz-notices-toast');
  }

  async _patchAnnouncements () {
    const { base } = getModule('base', 'container');
    const instance = getOwnerInstance(await waitForElement(`.${base.split(' ')[0]}`));
    patch('vz-notices-announcements', instance.__proto__, 'render', (_, res) => {
      res.props.children[1].props.children.unshift(React.createElement(AnnouncementContainer));
      return res;
    });

    instance.forceUpdate();
  }

  async _patchToasts () {
    const { app } = getModule('app', 'layers');
    const Shakeable = getModuleByDisplayName('Shakeable');
    patch('vz-notices-toast', Shakeable.prototype, 'render', (_, res) => {
      if (!res.props.children.find(child => child.type && child.type.name === 'ToastContainer')) {
        res.props.children.push(React.createElement(ToastContainer));
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
        text: store.getGuilds(GUILD_ID) ? 'Go to Server' : 'Join Server',
        onClick: () => {
          const inviteStore = getModule('acceptInviteAndTransitionToInviteChannel');
          inviteStore.acceptInviteAndTransitionToInviteChannel(INVITE_CODE);
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

module.exports = Notices;