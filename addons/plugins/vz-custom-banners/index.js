/* eslint-disable prefer-destructuring */
const { getModuleByDisplayName } = require('@webpack');
const { patch, unpatch } = require('@patcher');
const { Plugin } = require('@entities');

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
