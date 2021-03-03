import { patch, unpatch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';

export const labels = [ 'Guilds' ];

export default main => {
  const GuildFolder = getModule(m => m.default?.type?.render?.toString()?.includes('defaultFolderName'));
  patch('vz-attributes-guild-folders', GuildFolder?.default?.type, 'render', ([ props ], res) => {
    try {
      const { unread, selected, expanded, audio, video, screenshare, badge: mentions } = props;
      res.props['vz-unread'] = Boolean(unread) && '';
      res.props['vz-selected'] = Boolean(selected) && '';
      res.props['vz-expanded'] = Boolean(expanded) && '';
      res.props['vz-collapsed'] = Boolean(!expanded) && '';
      res.props['vz-audio'] = Boolean(audio) && '';
      res.props['vz-video'] = Boolean(video) && '';
      res.props['vz-screenshare'] = Boolean(screenshare) && '';
      res.props['vz-mentioned'] = Boolean(mentions > 0) && '';
    } catch (err) {
      main.error(main._labels.concat(labels.concat('Folder')), err);
    }
  });
  return () => unpatch('vz-attributes-guild-folders');
};
