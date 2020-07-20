const { inject, uninject } = require('@injector');
const { joinClassNames } = require('@util');
const { getModule } = require('@webpack');

module.exports = () => {
  const CallTile = getModule(m => m.default && m.default.displayName === 'CallTile');

  inject('vz-utility-classes-privateCall', CallTile, 'default', ([ props ], res) => {
    if (!props | !props.participant || !res.props) return res;

    const { participant } = props;

    res.props['vz-user-id'] = participant.id;
    res.props['vz-user-name'] = participant.user.username;

    res.props.className = joinClassNames(
      res.props.className, {
        'vz-isSpeaking': participant.speaking,
        'vz-isRinging': participant.ringing,
        'vz-hasVideo': participant.voiceState.selfVideo,
        'vz-isSelfMute': participant.voiceState.selfMute,
        'vz-isSelfDeaf': participant.voiceState.selfDeaf
      });

    return res;
  });

  return () => uninject('vz-utility-classes-privateCall');
};
