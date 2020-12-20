const { react: { forceUpdateElement } } = require('@vizality/util');
const { patch, unpatch } = require('@vizality/patcher');
const { getModule } = require('@vizality/webpack');
const { React } = require('@vizality/react');

module.exports = () => {
  const ApplicationCommandDiscoverySectionList = getModule(m => m.default?.displayName === 'ApplicationCommandDiscoverySectionList');
  const { rail } = getModule('rail');

  patch('vz-attributes-assd', ApplicationCommandDiscoverySectionList, 'default', (args) => {
    args[0].sections[args[0].sections.length] = {
      icon: 'vz-plugin://better-code-blocks/assets/icon.png',
      id: 'better-code-blocks',
      isBuiltIn: false,
      name: 'Better Code Blocks'
    };

    args[0].sections[args[0].sections.length] = {
      icon: 'vz-plugin://vz-spotify/assets/icon.png',
      id: 'spotify-in-discord',
      isBuiltIn: false,
      name: 'Spotify in Discord'
    };

    args[0].sections[args[0].sections.length] = {
      icon: 'https://cdn.vizality.com/assets/logo.png',
      id: 'vizality',
      isBuiltIn: false,
      name: 'Vizality'
    };

    return args;
  }, true);

  setImmediate(() => forceUpdateElement(`.${rail}`));

  return () => unpatch('vz-attributes-assd');
};
