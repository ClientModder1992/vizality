/* eslint-disable prefer-destructuring */
const { Plugin } = require('vizality/entities');
const { getModuleByDisplayName } = require('vizality/webpack');
const { inject, uninject } = require('vizality/injector');

module.exports = class CustomBanners extends Plugin {
  startPlugin () {
    this.loadStylesheet('style.scss');

    this._patchPrivateChannelEmptyMessage();
  }

  async _patchPrivateChannelEmptyMessage () {
    const PrivateChannelEmptyMessage = getModuleByDisplayName('PrivateChannelEmptyMessage');

    inject('pc-impChannelTitlebar-privateChannelsEmptyMessage', PrivateChannelEmptyMessage.prototype, 'render', (_, res) => {
      console.log(res);

      return res;
    });

    return async () => uninject('pc-impChannelTitlebar-privateChannelsEmptyMessage');
  }
};
