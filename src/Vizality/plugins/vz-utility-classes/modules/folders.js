/* eslint-disable no-unreachable */

const { inject, uninject } = require('vizality/injector');
const { getModule } = require('vizality/webpack');
const { joinClassNames } = require('vizality/util');

module.exports = () => {
  const GuildFolder = getModule(m => m.default && m.default.type && m.default.type.toString().includes('defaultFolderName'));

  inject('vz-utility-classes-folders', GuildFolder.default, 'type', (originalArgs, returnValue) => {
    const { folderName, unread, selected, expanded, audio, video, screenshare, badge: mentions } = originalArgs[0];

    returnValue.props.className = joinClassNames(
      returnValue.props.className, {
        'vz-isUnread': unread,
        'vz-isSelected': selected,
        'vz-isExpanded': expanded,
        'vz-isCollapsed': !expanded,
        'vz-hasAudio': audio,
        'vz-hasVideo': video,
        'vz-hasScreenshare': screenshare,
        'vz-isMentioned': mentions > 0
      });

    if (folderName && folderName !== '') {
      returnValue.props['vz-folder-name'] = folderName;
    }

    return returnValue;
  });

  return () => uninject('vz-utility-classes-folders');
};
