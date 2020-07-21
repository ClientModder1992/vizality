const { joinClassNames, react : { findInReactTree, forceUpdateElement } } = require('@util');
const { getModule, getModuleByDisplayName } = require('@webpack');
const { patch, unpatch } = require('@patcher');

/*
 * Attempt at patching lazy loading...
 */

module.exports = async () => {
  return () => void 0;

  const List  = getModuleByDisplayName('List');

  patch('vz-improved-navigation-dmChannels', List.prototype, 'renderRow', (args, res) => {
    // const props = findInReactTree(res, n => n.id);

    // if (!props.id || props.id !== 'private-channels') return res;

    // const test = findInReactTree(props, n => n.key);

    // const keys = [ 'friends', 'library', 'nitro' ];

    /*
     * if (keys.includes(test.key)) {
     *   console.log('hmm');
     * }
     */

    console.log(args);
    console.log(res);

    return res;
  });

  setImmediate(() => forceUpdateElement('.scroller-2FKFPG'));

  /*
   * return async () => unpatch('vz-improved-navigation-dmChannels');
   * const ConnectedPrivateChannelsList  = await getModule(m => m.default && m.default.displayName === 'ConnectedPrivateChannelsList', true);
   */

  /*
   * patch('vz-improved-navigation-dmChannels', ConnectedPrivateChannelsList, 'default', (args, res) => {
   *   console.log(res);
   */

  /*
   *   return res;
   * });
   */

  return async () => unpatch('vz-improved-navigation-dmChannels');
};
