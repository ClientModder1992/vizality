const { joinClassNames } = require('@utilities');
const { patch, unpatch } = require('@patcher');
const { getModule } = require('@webpack');

module.exports = () => {
  const GuildFolder = getModule(m => m.default && m.default.type && m.default.type.toString().includes('defaultFolderName'));

  patch('vz-utility-classes-folders', GuildFolder.default, 'type', (args, res) => {
    const { folderName, unread, selected, expanded, audio, video, screenshare, badge: mentions } = args[0];

    res.props.className = joinClassNames(
      res.props.className, {
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
      res.props['vz-folder-name'] = folderName;
    }

    return res;
  });

  return () => unpatch('vz-utility-classes-folders');
};
