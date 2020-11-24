const { nativeImage } = require('electron');

const webpack = require('../../webpack');

module.exports = {
  // @todo Figure out why this isn't working.
  async captureElement (selector) {
    return (await (() => {
      const getSources = webpack.getModule('DesktopSources', 'default').default;
      const mediaEngine = webpack.getModule('getMediaEngine').getMediaEngine();
      async function capture (selector) {
        const el = document.querySelector(selector);
        const elRect = el.getBoundingClientRect();
        const sources = await getSources(mediaEngine, [ 'window' ], { width: window.outerWidth, height: window.outerHeight });
        const discord = sources.find(src => src.name === `${document.title} - Discord` || src.name === 'Discord');
        const img = nativeImage.createFromDataURL(discord.url);
        return img.crop(elRect);
      }

      return capture(selector);
    })()).toDataURL();
  }
};
