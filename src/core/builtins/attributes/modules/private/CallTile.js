import { patch, unpatch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';

export const labels = [ 'Private' ];

export default main => {
  const CallTile = getModule(m => m.default?.displayName === 'CallTile')?.default;
  patch('vz-attributes-private-call', CallTile, 'type', ([ props ], res) => {
    try {
      const { participant } = props;
      if (!participant) return;
      res.props['vz-self-mute'] = Boolean(participant.voiceState?.selfMute) && '';
      res.props['vz-self-deaf'] = Boolean(participant.voiceState?.selfDeaf) && '';
      res.props['vz-video'] = Boolean(participant.voiceState?.selfVideo) && '';
      res.props['vz-speaking'] = Boolean(participant.speaking) && '';
      res.props['vz-ringing'] = Boolean(participant.ringing) && '';
      res.props['vz-user-id'] = participant.id;
    } catch (err) {
      main.error(main._labels.concat(labels.concat('CallTile')), err);
    }
  });
  return () => unpatch('vz-attributes-private-call');
};
