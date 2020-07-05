const { inject, uninject } = require('vizality/injector');
const { getModule } = require('vizality/webpack');
const { forceUpdateElement, getOwnerInstance, waitFor, joinClassNames } = require('vizality/util');

module.exports = async () => {
  /*
   * @todo: Fix this
   * Apparently Discord changed the structure a while ago and nobody really noticed
   * Injecting into this seems more painful than before but eh
   */
  return () => void 0;

  /* eslint-disable no-unreachable */
  const folderClasses = await getModule([ 'wrapper', 'folder' ]);
  const instance = getOwnerInstance(await waitFor(`.${folderClasses.wrapper.split(' ')[0]}`));
  await getModule([ 'wrapper', 'folder' ]);

  inject('vz-utility-classes-folders', instance.__proto__, 'render', (originalArgs, returnValue) => {
    if (!returnValue.props) return returnValue;
    console.log(returnValue);

    const { props } = returnValue;

    props.className = joinClassNames(
      props.className, {
        'vz-isUnread': props.unread,
        'vz-isSelected': props.selected,
        'vz-isExpanded': props.expanded,
        'vz-hasAudio': props.audio,
        'vz-hasVideo': props.video,
        'vz-hasScreenshare': props.screenshare,
        'vz-isMentioned': props.badge > 0
      });

    props['vz-folder-name'] = props.folderName;

    return returnValue;
  });

  setImmediate(() => forceUpdateElement(`.${folderClasses.wrapper.split(' ')[0]}`, true));
  return () => uninject('vz-utility-classes-folders');
};
