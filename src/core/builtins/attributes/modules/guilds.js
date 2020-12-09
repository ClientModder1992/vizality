const { patch, unpatch } = require('@vizality/patcher');
const { getModule } = require('@vizality/webpack');
const { React } = require('@vizality/react');

module.exports = () => {
  const DragSourceConnectedGuild = getModule('LurkingGuild');
  const { DecoratedComponent } = DragSourceConnectedGuild.default;

  const g = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher.current;
  const ogUseState = g.useState;
  const ogUseLayoutEffect = g.useLayoutEffect;
  const ogUseContext = g.useContext;
  const ogUseRef = g.useRef;

  g.useState = () => [ null, () => void 0 ];
  g.useLayoutEffect = () => null;
  g.useRef = () => ({});
  g.useContext = () => ({});

  const Guild = new DecoratedComponent({ guildId: null }).type;

  g.useState = ogUseState;
  g.useLayoutEffect = ogUseLayoutEffect;
  g.useContext = ogUseContext;
  g.useRef = ogUseRef;

  patch('vz-attributes-guilds', Guild.prototype, 'render', function (_, res) {
    // This was needed for guilds with outages, not sure if it's needed anymore.
    if (!res) return _;

    const { audio, badge: mentions, selected, unread, video, screenshare, guildId } = this.props;

    res.props['vz-guild-id'] = guildId;
    res.props['vz-unread'] = Boolean(unread) && '';
    res.props['vz-selected'] = Boolean(selected) && '';
    res.props['vz-audio'] = Boolean(audio) && '';
    res.props['vz-video'] = Boolean(video) && '';
    res.props['vz-screenshare'] = Boolean(screenshare) && '';
    res.props['vz-mentioned'] = Boolean(mentions > 0) && '';

    return res;
  });

  return () => unpatch('vz-attributes-guilds');
};
