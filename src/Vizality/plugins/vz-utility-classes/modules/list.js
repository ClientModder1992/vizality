const { inject, uninject } = require('vizality/injector');
const { getModule, getModuleByDisplayName } = require('vizality/webpack');
const { findInReactTree, classNames, forceUpdateElement } = require('vizality/util');

module.exports = async () => {
  return () => void 0;

  const List  = await getModuleByDisplayName('List');

  inject('vz-improved-navigation-dmChannels', List.prototype, 'renderRow', (originalArgs, returnValue) => {
    // const props = findInReactTree(returnValue, n => n.id);

    // if (!props.id || props.id !== 'private-channels') return returnValue;

    // const test = findInReactTree(props, n => n.key);

    // const keys = [ 'friends', 'library', 'nitro' ];

    // if (keys.includes(test.key)) {
    //   console.log('hmm');
    // }

    console.log(originalArgs);
    console.log(returnValue);

    return returnValue;
  });

  setImmediate(() => forceUpdateElement('.scroller-2FKFPG'));

  // return async () => uninject('vz-improved-navigation-dmChannels');
  // const ConnectedPrivateChannelsList  = await getModule(m => m.default && m.default.displayName === 'ConnectedPrivateChannelsList');

  // inject('vz-improved-navigation-dmChannels', ConnectedPrivateChannelsList, 'default', (originalArgs, returnValue) => {
  //   console.log(returnValue);

  //   return returnValue;
  // });

  return async () => uninject('vz-improved-navigation-dmChannels');
};
