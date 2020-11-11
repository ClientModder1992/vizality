const { patch, unpatch } = require('@vizality/patcher');
const { joinClassNames } = require('@vizality/util');
const { getModule } = require('@vizality/webpack');

module.exports = () => {
  const CallTile = getModule(m => m.default && m.default.displayName === 'CallTile');

  patch('vz-attributes-privateCall', CallTile, 'default', ([ props ], res) => {
    if (!props | !props.participant || !res.props) return res;

    const { participant } = props;

    res.props['vz-user-id'] = participant.id;
    res.props['vz-user-name'] = participant.user.username;

    res.props.className = joinClassNames(
      res.props.className, {
        'vz-isSpeaking': participant.speaking,
        'vz-isRinging': participant.ringing,
        'vz-hasVideo': participant.voiceState && participant.voiceState.selfVideo,
        'vz-isSelfMute': participant.voiceState && participant.voiceState.selfMute,
        'vz-isSelfDeaf': participant.voiceState && participant.voiceState.selfDeaf
      });

    return res;
  });

  return () => unpatch('vz-attributes-privateCall');
};
