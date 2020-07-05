const { inject, uninject } = require('vizality/injector');
const { getModule } = require('vizality/webpack');
const { joinClassNames } = require('vizality/util');

module.exports = async () => {
  const CallTile = await getModule(m => m.default && m.default.displayName === 'CallTile');

  inject('vz-utility-classes-privateCall', CallTile, 'default', ([ props ], returnValue) => {
    if (!props | !props.participant || !returnValue.props) return returnValue;

    const { participant } = props;

    returnValue.props['vz-user-id'] = participant.id;
    returnValue.props['vz-user-name'] = participant.user.username;

    returnValue.props.className = joinClassNames(
      returnValue.props.className, {
        'vz-isSpeaking': participant.speaking,
        'vz-isRinging': participant.ringing,
        'vz-hasVideo': participant.voiceState.selfVideo,
        'vz-isSelfMute': participant.voiceState.selfMute,
        'vz-isSelfDeaf': participant.voiceState.selfDeaf
      });

    return returnValue;
  });

  return async () => uninject('vz-utility-classes-privateCall');
};
