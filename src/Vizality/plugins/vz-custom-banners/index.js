/* eslint-disable prefer-destructuring */
const { getModuleByDisplayName } = require('@webpack');
const { inject, uninject } = require('@injector');
const { Plugin } = require('@entities');

class CustomBanners extends Plugin {
  startPlugin () {
    this.loadStylesheet('style.scss');

    this._patchPrivateChannelEmptyMessage();
  }

  _patchPrivateChannelEmptyMessage () {
    const PrivateChannelEmptyMessage = getModuleByDisplayName('PrivateChannelEmptyMessage');

    inject('vz-custom-banners-privateChannelsEmptyMessage', PrivateChannelEmptyMessage.prototype, 'render', (_, res) => {
      // @todo: Do this.
      console.log(res);

      return res;
    });

    return () => uninject('vz-custom-banners-privateChannelsEmptyMessage');
  }
}

module.exports = CustomBanners;
