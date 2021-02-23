import { patch, unpatch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';

export default () => {
  const CallTile = getModule(m => m.default?.displayName === 'CallTile');

  if (!CallTile) return;

  patch('vz-attributes-private-call', CallTile.default, 'type', ([ props ], res) => {
    const { participant } = props;

    res.props['vz-self-mute'] = Boolean(participant?.voiceState?.selfMute) && '';
    res.props['vz-self-deaf'] = Boolean(participant?.voiceState?.selfDeaf) && '';
    res.props['vz-video'] = Boolean(participant?.voiceState?.selfVideo) && '';
    res.props['vz-speaking'] = Boolean(participant?.speaking) && '';
    res.props['vz-ringing'] = Boolean(participant?.ringing) && '';
    res.props['vz-user-id'] = participant?.id;

    return res;
  });

  return () => unpatch('vz-attributes-private-call');
};
