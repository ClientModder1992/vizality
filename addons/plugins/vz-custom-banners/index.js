/* eslint-disable prefer-destructuring */
const { getModuleByDisplayName } = require('@vizality/webpack');
const { patch, unpatch } = require('@vizality/patcher');
const { Plugin } = require('@vizality/entities');

module.exports = class CustomBanners extends Plugin {
  onStart () {
    this.injectStyles('styles/main.scss');
    this._patchPrivateChannelEmptyMessage();
  }

  onStop () {
    unpatch('vz-custom-banners-privateChannelsEmptyMessage');
  }

  _patchPrivateChannelEmptyMessage () {
    const PrivateChannelEmptyMessage = getModuleByDisplayName('PrivateChannelEmptyMessage');

    patch('vz-custom-banners-privateChannelsEmptyMessage', PrivateChannelEmptyMessage.prototype, 'render', (_, res) => {
      // @todo: Do this.
      console.log(res);

      return res;
    });
  }
};
