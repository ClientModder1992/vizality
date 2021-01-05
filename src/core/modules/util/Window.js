import { nativeImage } from 'electron';

import { getModule } from '../webpack';

// @todo Figure out why this isn't working for Windows users.
export const captureElement = async selector => {
  return (await (() => {
    const getSources = getModule('DesktopSources', 'default').default;
    const mediaEngine = getModule('getMediaEngine').getMediaEngine();
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
};
