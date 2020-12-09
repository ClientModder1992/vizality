const { patch, unpatch } = require('@vizality/patcher');
const { getModule } = require('@vizality/webpack');

module.exports = () => {
  const GuildFolder = getModule(m => m.default && (
    (m.default.type?.render?.toString().includes('defaultFolderName')) ||
    (m.default.type?.__vizalityOriginal_render?.toString().includes('defaultFolderName'))
  ));

  patch('vz-attributes-guild-folders', GuildFolder.default.type, 'render', (args, res) => {
    const { unread, selected, expanded, audio, video, screenshare, badge: mentions } = args[0];

    res.props['vz-unread'] = Boolean(unread) && '';
    res.props['vz-selected'] = Boolean(selected) && '';
    res.props['vz-expanded'] = Boolean(expanded) && '';
    res.props['vz-collapsed'] = Boolean(!expanded) && '';
    res.props['vz-audio'] = Boolean(audio) && '';
    res.props['vz-video'] = Boolean(video) && '';
    res.props['vz-screenshare'] = Boolean(screenshare) && '';
    res.props['vz-mentioned'] = Boolean(mentions > 0) && '';

    return res;
  });

  return () => unpatch('vz-attributes-guild-folders');
};
