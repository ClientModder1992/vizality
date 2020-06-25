/* eslint-disable prefer-destructuring */
const { Plugin } = require('vizality/entities');
const { React, getModuleByDisplayName, getModule, i18n } = require('vizality/webpack');
const { inject, uninject } = require('vizality/injector');
const { findInReactTree, forceUpdateElement } = require('vizality/util');

module.exports = class CustomBanners extends Plugin {
  startPlugin () {
    this.loadStylesheet('style.scss');

    this._patchPrivateChannelEmptyMessage();
  }

  async _patchPrivateChannelEmptyMessage () {
    const PrivateChannelEmptyMessage = await getModuleByDisplayName('PrivateChannelEmptyMessage');

    inject('pc-impChannelTitlebar-privateChannelsEmptyMessage', PrivateChannelEmptyMessage.prototype, 'render', (_, res) => {
      console.log(res);

      return res;
    });

    return async () => uninject('pc-impChannelTitlebar-privateChannelsEmptyMessage');
  }
};
