const { patch, unpatch } = require('@vizality/patcher');
const { getModule } = require('@vizality/webpack');

module.exports = () => {
  const CallTile = getModule(m => m.default?.displayName === 'CallTile');

  patch('vz-attributes-private-call', CallTile, 'default', ([ props ], res) => {
    if (!props?.participant || !res.props) return res;

    const { participant } = props;

    res.props['vz-user-id'] = participant.id;
    res.props['vz-speaking'] = Boolean(participant.speaking) && '';
    res.props['vz-ringing'] = Boolean(participant.ringing) && '';
    res.props['vz-video'] = Boolean(participant.voiceState?.selfVideo) && '';
    res.props['vz-self-mute'] = Boolean(participant.voiceState?.selfMute) && '';
    res.props['vz-self-deaf'] = Boolean(participant.voiceState?.selfDeaf) && '';

    return res;
  });

  return () => unpatch('vz-attributes-private-call');
};
