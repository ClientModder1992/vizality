const { inject, uninject } = require('vizality/injector');
const { getModule, i18n } = require('vizality/webpack');
const { waitFor, joinClassNames, react: { forceUpdateElement, getOwnerInstance }, string: { toCamelCase } } = require('vizality/util');

module.exports = async () => {
  const channelHeaderButtonClasses = await getModule([ 'iconWrapper', 'toolbar' ], true);
  const instance = getOwnerInstance(await waitFor(`.${channelHeaderButtonClasses.iconWrapper}`));

  if (!instance) return;

  inject('vz-utility-classes-channelHeaderButtons', instance.__proto__, 'render', (originalArgs, returnValue) => {
    if (!returnValue.props.className) return returnValue;

    const classes = returnValue.props.className.split(' ');
    if (classes.includes(channelHeaderButtonClasses.iconWrapper)) {
      if (returnValue.props['aria-label']) {
        const key = Object.keys(i18n._proxyContext.messages).find(key => i18n._proxyContext.messages[key] === returnValue.props['aria-label']);
        // console.log(key);
        if (!key) return returnValue;

        if (key === 'PINNED_MESSAGES') {
          if (returnValue.props.children[1]) {
            returnValue.props.className = joinClassNames(returnValue.props.className, 'vz-isUnread');
          }
        }
        /*
         * @todo: So far this only doesn't work with the mute/unmute channel button because Discord uses formatting for it,
         * and I'm not sure how to fix that, but it still needs fixing. This is just a bandaid fix that works for now.
         */
        /*
         * if (!addedClass) {
         *   if (returnValue.props['aria-checked']) {
         *     returnValue.props.className = [ returnValue.props.className, 'vz-unmuteChannelButton' ].filter(Boolean).join(' ');
         *   } else {
         *     returnValue.props.className = [ returnValue.props.className, 'vz-muteChannelButton' ].filter(Boolean).join(' ');
         *   }
         *   return returnValue;
         * }
         */
        returnValue.props.className = joinClassNames(returnValue.props.className, `vz-${toCamelCase(key)}Button`);
      }
    }

    return returnValue;
  });

  setImmediate(() => forceUpdateElement(`.${channelHeaderButtonClasses.iconWrapper}`, true));

  return () => uninject('vz-utility-classes-channelHeaderButtons');
};
